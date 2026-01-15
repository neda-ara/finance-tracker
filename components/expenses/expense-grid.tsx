"use client";

import { ACTION_CONSTANTS } from "@/lib/constants/constants";
import { Button } from "../ui/button";
import { useState } from "react";
import { DataGrid } from "../common/data-grid";
import { Modal } from "../common/modal";

export const ExpenseGrid = () => {
  const [action, setAction] = useState<typeof ACTION_CONSTANTS | undefined>();

  return (
    <div>
      <div>My Expenses</div>
      <Button variant="cta">+ Add New</Button>
      <Modal />
      <DataGrid />
    </div>
  );
};
