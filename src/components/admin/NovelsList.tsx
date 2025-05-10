
import { useState, useEffect } from "react";
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
import { getNovels, updateNovelStatus, deleteNovel } from "@/services/novelService";
import { Novel } from "@/types/supabase";

interface NovelsListProps {
  onEdit: (novelId: string) => void;
}

const NovelsList = ({ onEdit }: NovelsListProps) => {
  const { toast } = useToast();
  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);

  // استرجاع قائمة الروايات عند تحميل المكون
  useEffect(() => {
    const loadNovels = async () => {
      try {
        const novelsData = await getNovels();
        setNovels(novelsData);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "خطأ في تحميل البيانات",
          description: "حدث خطأ أثناء استرجاع الروايات. يرجى المحاولة مرة أخرى.",
        });
        console.error("خطأ في تحميل الروايات:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNovels();
  }, [toast]);

  const handleDelete = async (id: string) => {
    try {
      await deleteNovel(id);
      // تحديث القائمة المحلية بعد الحذف
      setNovels(novels.filter((novel) => novel.id !== id));
      toast({
        title: "تم حذف الرواية",
        description: "تم حذف الرواية بنجاح",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ في الحذف",
        description: "حدث خطأ أثناء محاولة حذف الرواية. يرجى المحاولة مرة أخرى.",
      });
      console.error("خطأ في حذف الرواية:", error);
    } finally {
      setDeleteDialog(null);
    }
  };

  const handleStatusChange = async (id: string, status: "published" | "draft") => {
    try {
      const updatedNovel = await updateNovelStatus(id, status);
      // تحديث القائمة المحلية بعد التغيير
      setNovels(novels.map(novel => novel.id === id ? {...novel, status: updatedNovel.status} : novel));
      toast({
        title: status === "published" ? "تم نشر الرواية" : "تم حفظ الرواية كمسودة",
        description: "تم تحديث حالة الرواية بنجاح",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ في تغيير الحالة",
        description: "حدث خطأ أثناء محاولة تغيير حالة الرواية. يرجى المحاولة مرة أخرى.",
      });
      console.error("خطأ في تغيير حالة الرواية:", error);
    }
  };

  if (loading) {
    return <div className="py-8 text-center">جاري تحميل البيانات...</div>;
  }

  return (
    <>
      {novels.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">لا توجد روايات حالياً. أضف رواية جديدة للبدء.</p>
        </div>
      ) : (
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
                  <TableCell>{new Date(novel.created_at).toLocaleDateString("ar-SA")}</TableCell>
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
                        novel.is_premium
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {novel.is_premium ? "حصرية" : "مجانية"}
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
      )}

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
