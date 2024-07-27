"use client";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
// UTILS
import { api } from "@/trpc/react";
import { formatAmount } from "@/lib/utils";
// TYPES
import type Stripe from "stripe";
import type { FunnelType, FunnelWithPagesType } from "@/lib/types";
// UI
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";
import { Input } from "@ui/input";
import { Button } from "@ui/button";

type Props = {
  funnel: FunnelWithPagesType;
  products: Stripe.Product[];
};

export function FunnelProductTable({ funnel, products }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [liveProducts, setLiveProducts] = useState<FunnelType["liveProducts"]>(
    funnel.liveProducts,
  );

  const { mutateAsync: updateFunnelProducts } =
    api.funnel.updateProducts.useMutation();

  const { mutateAsync: saveActivityLog } =
    api.notification.saveActivityLog.useMutation();

  const handleSaveProducts = () => {
    startTransition(async () => {
      const actionRes = await updateFunnelProducts({
        liveProducts,
        funnelId: funnel.id,
      });

      if (actionRes.status === "SUCCESS") {
        await saveActivityLog({
          subAccountId: funnel.subAccountId,
          activity: `Update funnel products | ${funnel.name}`,
        });

        router.refresh();
      } else {
        toast.error("Unable to save products");
      }
    });
  };

  const handleAddProduct = async (product: Stripe.Product) => {
    const productIdExists = liveProducts.find(
      /* @ts-expect-error payment intent is available */
      (prod) => prod.productId === product.default_price.id,
    );
    productIdExists
      ? setLiveProducts(
          liveProducts.filter(
            (prod) =>
              prod.productId !==
              /* @ts-expect-error payment intent is available */
              product.default_price?.id,
          ),
        )
      : setLiveProducts([
          ...liveProducts,
          {
            /* @ts-expect-error payment intent is available */
            productId: product.default_price.id as string,
            /* @ts-expect-error payment intent is available */
            recurring: !!product.default_price.recurring,
          },
        ]);
  };

  return (
    <>
      <Table className="rounded-md border-[1px] border-border bg-card">
        <TableHeader className="rounded-md">
          <TableRow>
            <TableHead>Live</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Interval</TableHead>
            <TableHead className="text-right">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="truncate font-medium">
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Input
                  defaultChecked={
                    !!liveProducts.find(
                      /* @ts-expect-error product id is available */
                      (prod) => prod.productId === product.default_price?.id,
                    )
                  }
                  onChange={() => handleAddProduct(product)}
                  type="checkbox"
                  className="h-4 w-4"
                />
              </TableCell>
              <TableCell>
                {product.images[0] && (
                  <Image
                    alt="product Image"
                    height={60}
                    width={60}
                    src={product.images[0]}
                  />
                )}
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>
                {
                  /* @ts-expect-error payment intent is available */
                  product.default_price?.recurring ? "Recurring" : "One Time"
                }
              </TableCell>
              <TableCell className="text-right">
                {
                  /* @ts-expect-error payment intent is available */
                  formatAmount(product.default_price?.unit_amount / 100)
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        disabled={isPending || liveProducts.length === 0}
        onClick={handleSaveProducts}
        className="mt-4"
      >
        Save Products
      </Button>
    </>
  );
}
