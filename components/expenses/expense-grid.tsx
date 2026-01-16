"use client";

import { ACTION_CONSTANTS } from "@/lib/constants/constants";
import { Button } from "../ui/button";
import { useState } from "react";
import { DataGrid } from "../common/data-grid";
import { Modal } from "../common/modal";
import { DialogClose } from "../ui/dialog";

export const ExpenseGrid = () => {
  const [action, setAction] = useState<typeof ACTION_CONSTANTS | undefined>();

  return (
    <div>
      <div>My Expenses</div>

      <Modal
        dialogTrigger={<Button variant="cta">+ Add New</Button>}
        dialogTitle={<p>TITLE</p>}
        dialogContent={<p>CONTENT</p>}
        showFooter={true}
        footerContent={
          <>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </>
        }
      />
      <DataGrid />
    </div>
  );
};
