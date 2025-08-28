import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { BacklogItem } from "@/lib/mock-data";

interface BacklogTableProps {
  data: BacklogItem[];
}

export function BacklogTable({ data }: BacklogTableProps) {
  return (
    <Card>
      <CardHeader>
          <CardTitle>Current Backlog</CardTitle>
          <CardDescription>
            Orders that are currently waiting for processing.
          </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Store</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Payment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.orderId}>
                <TableCell className="font-medium">{item.store}</TableCell>
                <TableCell>{item.orderId}</TableCell>
                <TableCell>
                    <Badge variant="outline">{item.source}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={item.payment === 'Paid' ? 'secondary' : 'destructive'}>
                    {item.payment}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
