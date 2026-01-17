import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ModalProps } from "@/lib/actions/types";

export function Modal(props: ModalProps) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <form>
        <DialogTrigger asChild>{props?.dialogTrigger}</DialogTrigger>
        <DialogContent
          showCloseButton={props?.showCloseButton}
          className="sm:max-w-106.25"
        >
          <DialogHeader>
            <DialogTitle>{props?.dialogTitle}</DialogTitle>
            {props?.dialogDescription && (
              <DialogDescription>{props?.dialogDescription}</DialogDescription>
            )}
          </DialogHeader>
          {props?.dialogContent}
          {props?.showFooter && (
            <DialogFooter>{props?.footerContent}</DialogFooter>
          )}
        </DialogContent>
      </form>
    </Dialog>
  );
}
