import Image from "next/image";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function LeaderBoard({ gamescores }: { gamescores: any[] }) {
  //sort submission by highest votes
  gamescores.sort((a, b) => b.score_value - a.score_value);

  return (
    <div className=" border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Player</TableHead>
            <TableHead></TableHead>
            <TableHead className="text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gamescores.map((score) => (
            <TableRow key={score._id}>
              <TableCell className="font-medium py-1.5">
                <Image
                  src={score.player?.picture}
                  alt="submission"
                  width={38}
                  height={38}
                  className="rounded-lg object-cover transition-all aspect-[1]"
                />
              </TableCell>
              <TableCell className="w-[200px]">{score.player?.name}</TableCell>
              <TableCell className="text-right">{score.score_value} </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
