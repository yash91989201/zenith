import { format } from "date-fns";
// UTILS
import { api } from "@/trpc/server";
import { totalTicketValue } from "@/lib/utils";
// UI
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";
import { Badge } from "@ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
// CUSTOM COMPONENTS
import BlurPage from "@global/blur-page";
import { CreateContactButton } from "@/components/contacts/create-contact-button";

type Props = {
  params: {
    subaccountId: string;
  };
};

export default async function SubAccountContactPage({ params }: Props) {
  const subAccountContact = await api.contact.getSubAccount({
    subAccountId: params.subaccountId,
  });

  if (!subAccountContact) return null;

  const allContacts = subAccountContact.contacts;

  const subAccounts = await api.user.getAccessibleSubAccounts();

  return (
    <BlurPage>
      <div className="flex items-center justify-between">
        <h1 className="p-3 text-4xl">Contacts</h1>
        <CreateContactButton subAccounts={subAccounts} />
      </div>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-48">Name</TableHead>
            <TableHead className="w-72">Email</TableHead>
            <TableHead className="w-48">Active</TableHead>
            <TableHead className="w-24">Created At</TableHead>
            <TableHead className="w-24">Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allContacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell>
                <Avatar>
                  <AvatarImage alt="@shadcn" />
                  <AvatarFallback className="bg-primary text-white">
                    {contact.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>{contact.email}</TableCell>
              <TableCell>
                {totalTicketValue(contact.tickets) === null ? (
                  <Badge variant="destructive">Inactive</Badge>
                ) : (
                  <Badge className="bg-emerald-700">Active</Badge>
                )}
              </TableCell>
              <TableCell>{format(contact.createdAt, "MM/dd/yyyy")}</TableCell>
              <TableCell className="text-right">
                {totalTicketValue(contact.tickets) ?? "$0.00"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </BlurPage>
  );
}
