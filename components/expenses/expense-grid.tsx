"use client";

import { ACTION_CONSTANTS } from "@/lib/constants/constants";
import { Button } from "../ui/button";
import { useState } from "react";
import { DataGrid } from "../common/data-grid";
import { Modal } from "../common/modal";
import { ActionConstant, ModalContent } from "@/lib/actions/types";
import { ExpenseForm } from "./expense-form";
import { Plus } from "lucide-react";

type Expense = {
  amount: number;
};

export const ExpenseGrid = () => {
  const [action, setAction] = useState<ActionConstant | undefined>();
  const [quickActionData, setQuickActionData] = useState<Expense | undefined>();
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const actionHandler = (action: ActionConstant, data?: Expense) => {
    setAction(action);
    setQuickActionData(data);
    setOpenModal(true);
  };

  const modalContentMap = new Map<ActionConstant, ModalContent>([
    [
      ACTION_CONSTANTS.CREATE,
      {
        header: <p>Add New Expense</p>,
        body: <ExpenseForm />,
      },
    ],
    [
      ACTION_CONSTANTS.EDIT,
      {
        header: <p>Update Expense - {quickActionData?.amount}</p>,
        body: <ExpenseForm />,
      },
    ],
    [
      ACTION_CONSTANTS.DELETE,
      {
        header: <p>Delete Expense</p>,
        body: <ExpenseForm />,
      },
    ],
  ]);

  return (
    <div>
      <Button
        variant="cta"
        className="font-medium"
        onClick={() => actionHandler(ACTION_CONSTANTS.CREATE)}
      >
        <Plus /> Add New
      </Button>
      <Modal
        open={openModal}
        onOpenChange={handleOpenModal}
        dialogTitle={modalContentMap.get(action!)?.header}
        dialogContent={modalContentMap.get(action!)?.body}
        showFooter={true}
        footerContent={
          <>
            <Button variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit">Save changes</Button>
          </>
        }
      />
      <DataGrid />
    </div>
  );
};
