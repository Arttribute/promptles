# Promptles

Promptles is an onchain game blending AI art with quick-witted guessing ! Create challenges, guess prompts, and compete for a spot on an onchain leaderboard secured by Sign Protocol attestations.

## Project Description

Promptles is an interactive web game where players decipher prompts from AI-generated art. Each challenge displays an AI-created image, and players must identify the original prompt that generated the image from a mix of correct and misleading word options. Points are awarded based on the speed and accuracy of the guesses.

It employs a Solidity smart contract on the Arbitrum Sepolia network to maintain a leaderboard. This leaderboard is exclusive to scores from players confirmed to be attempting the game for the first time, preventing the unfair advantage of having seen the challenge before. This verification is conducted using Sign Protocol, which uses attestations to ensure a player’s eligibility for leaderboard placement, thus maintaining the competitiveness and integrity of the leaderboard.

## How it's Made

Promptles leverages a combination of web technologies and blockchain mechanisms. The user interface is developed with Next.js, enhancing user experience through efficient and responsive design. The AI-generated images are created using Astria’s Stability Diffusion API, which allows for high-quality, customizable images based on textual prompts. The backend leverages MongoDB to store game details off-chain, and a Solidity smart contract deployed on the Arbitrum Sepolia network to maintain game leaderboards.

This smart contract handles onchain leaderboard operations and integrates with Sign Protocol to check player eligibility for leaderboard entry. The use of Sign Protocol ensures that only first-time game attempts are logged, preventing repeat scoring advantages and keeping the competition fair. Each attestation contains the player ID and the game ID to verify the uniqueness of each player's participation in a game.

The use of Hardhat facilitated the development, testing, and deployment of the smart contract, ensuring a reliable and secure integration into the blockchain network. The combination of these technologies — Next.js, MongoDB, Astria’s Stability Diffusion API, Solidity, Sign Protocol, and Arbitrum Sepolia — enables Promptles to offer a unique and fair gaming experience, leveraging the best of the web, AI, and blockchain capabilities.
