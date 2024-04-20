"use client";
const { SignProtocolClient, SpMode, EvmChains } = require("@ethsign/sp-sdk");
import axios from "axios";
import { decodeAbiParameters } from "viem";

export interface CreatedAttestation {
  attestationId: string;
  txHash: string;
  indexingValue: string;
}

export const client = new SignProtocolClient(SpMode.OnChain, {
  chain: EvmChains.arbitrumSepolia,
});

export async function makeAttestation(web3Address: string, game_id: string) {
  try {
    const res = await client.createAttestation({
      schemaId: "0x2f",
      data: {
        web3Address,
        game_id,
      },
      indexingValue: web3Address.toLowerCase(),
    });

    return res;
  } catch (error) {
    console.error(error);
  }
}

export async function makeAttestationRequest(endpoint: string, options: any) {
  const url = `https://testnet-rpc.sign.global/api/${endpoint}`;
  const res = await axios.request({
    url,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    ...options,
  });
  // throw API errors
  if (res.status !== 200) {
    throw new Error(JSON.stringify(res));
  }
  // return original response
  return res.data;
}

export async function queryAttestations(
  playerAddress: string,
  gameCreatorAddress: string
) {
  console.log("Querying Attestations for ", playerAddress, gameCreatorAddress);
  const response = await makeAttestationRequest("index/attestations", {
    method: "GET",
    params: {
      mode: "onchain", // Data storage location
      schemaId: "onchain_evm_421614_0x2f", // Your full schema's ID
      attester: playerAddress,
      indexingValue: gameCreatorAddress.toLowerCase(),
    },
  });

  // Make sure the request was successfully processed.
  if (!response.success) {
    return {
      success: false,
      message: response?.message ?? "Attestation query failed.",
    };
  }

  // Return a message if no attestations are found.
  if (response.data?.total === 0) {
    return {
      success: false,
      message: "No attestation for this address found.",
    };
  }

  // Return all attestations that match our query.
  return {
    success: true,
    attestations: response.data.rows,
  };
}

export function findAttestation(game_id: string, attestations: any[]) {
  // Iterate through the list of attestations
  for (const att of attestations) {
    if (!att.data) continue;

    let parsedData: any = {};

    // Parse the data.
    if (att.mode === "onchain") {
      // Looking for nested items in the on-chain schema
      try {
        const data = decodeAbiParameters(
          [
            att.dataLocation === "onchain"
              ? { components: att.schema.data, type: "tuple" }
              : { type: "string" },
          ],
          att.data
        );
        parsedData = data[0];
      } catch (error) {
        // Looking for a regular schema format if the nested parse fails
        try {
          const data = decodeAbiParameters(
            att.dataLocation === "onchain"
              ? att.schema.data
              : [{ type: "string" }],
            att.data
          );
          const obj: any = {};
          data.forEach((item: any, i: number) => {
            obj[att.schema.data[i].name] = item;
          });
          parsedData = obj;
        } catch (error) {
          continue;
        }
      }
    } else {
      // Try parsing as a string (off-chain attestation)
      try {
        parsedData = JSON.parse(att.data);
      } catch (error) {
        console.log(error);
        continue;
      }
    }

    // Return the correct attestation and its parsed data.
    if (parsedData?.game_id === game_id) {
      return { parsedData, attestation: att };
    }
  }

  // Did not find the attestation we are looking for.
  return undefined;
}
