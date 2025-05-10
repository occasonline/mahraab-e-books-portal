
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

interface Novel {
  id: string;
  title: string;
  author: string;
  category: string;
  date: string;
  isPremium: boolean;
  status: "published" | "draft";
}

// بيانات مؤقتة للروايات - سيتم استبدالها بالبيانات من قاعدة البيانات لاحقًا
const MOCK_NOVELS: Novel[] = [
  {
    id: "1",
    title: "في محراب التوبة",
    author: "محراب التوبة",
    category: "فلسفي",
    date: "2023-06-15",
    isPremium: false,
    status: "published"
  },
  {
    id: "2",
    title: "أسرار الصوفية",
    author: "محراب التوبة",
    category: "صوفي",
    date: "2023-08-20",
    isPremium: true,
    status: "published"
  },
  {
    id: "3",
    title: "طريق المريدين",
    author: "محراب التوبة",
    category: "روحاني",
    date: "2023-11-05",
    isPremium: false,
    status: "draft"
  },
];

interface NovelsListProps {
  onEdit: (novelId: string) => void;
}

const NovelsList = ({ onEdit }: NovelsListProps) => {
  const { toast } = useToast();
  const [novels] = useState<Novel[]>(MOCK_NOVELS);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    // هنا سيكون هناك طلب API لحذف الرواية
    // لأغراض العرض، سنعرض إشعارًا فقط
    toast({
      title: "تم حذف الرواية",
      description: "تم حذف الرواية بنجاح",
    });
    setDeleteDialog(null);
  };

  const handleStatusChange = (id: string, status: "published" | "draft") => {
    // هنا سيكون هناك طلب API لتغيير حالة الرواية
    toast({
      title: status === "published" ? "تم نشر الرواية" : "تم حفظ الرواية كمسودة",
      description: "تم تحديث حالة الرواية بنجاح",
    });
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>العنوان</TableHead>
              <TableHead>التصنيف</TableHead>
              <TableHead>تاريخ النشر</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>النوع</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {novels.map((novel) => (
              <TableRow key={novel.id}>
                <TableCell className="font-medium">{novel.title}</TableCell>
                <TableCell>{novel.category}</TableCell>
                <TableCell>{new Date(novel.date).toLocaleDateString("ar-SA")}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      novel.status === "published"
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {novel.status === "published" ? "منشورة" : "مسودة"}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      novel.isPremium
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {novel.isPremium ? "حصرية" : "مجانية"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(novel.id)}
                    >
                      تعديل
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => setDeleteDialog(novel.id)}
                    >
                      حذف
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleStatusChange(
                          novel.id,
                          novel.status === "published" ? "draft" : "published"
                        )
                      }
                    >
                      {novel.status === "published" ? "تعطيل" : "نشر"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في حذف هذه الرواية؟ هذا الإجراء لا يمكن التراجع عنه.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteDialog && handleDelete(deleteDialog)}
            >
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NovelsList;
