
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { getChaptersByNovelId, createChapter, updateChapter, deleteChapter, updateChapterStatus } from "@/services/chapterService";
import { Chapter } from "@/types/supabase";

interface ChapterEditorProps {
  novelId: string;
}

const ChapterEditor = ({ novelId }: ChapterEditorProps) => {
  const { toast } = useToast();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingChapter, setEditingChapter] = useState<Partial<Chapter> | null>(null);
  const [isNewChapter, setIsNewChapter] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);

  useEffect(() => {
    const loadChapters = async () => {
      try {
        const chaptersData = await getChaptersByNovelId(novelId);
        setChapters(chaptersData);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "خطأ في تحميل البيانات",
          description: "حدث خطأ أثناء استرجاع الفصول. يرجى المحاولة مرة أخرى.",
        });
        console.error("خطأ في تحميل الفصول:", error);
      } finally {
        setLoading(false);
      }
    };

    loadChapters();
  }, [novelId, toast]);

  const handleSaveChapter = async () => {
    if (!editingChapter) return;
    
    try {
      if (isNewChapter) {
        // إنشاء فصل جديد
        const newChapter = await createChapter({
          novel_id: novelId,
          title: editingChapter.title || "",
          content: editingChapter.content || "",
          order: editingChapter.order || chapters.length + 1,
          status: editingChapter.status || "draft"
        });
        
        setChapters([...chapters, newChapter]);
        toast({
          title: "تمت إضافة الفصل",
          description: "تم إضافة الفصل الجديد بنجاح",
        });
      } else {
        // تحديث فصل موجود
        const updatedChapter = await updateChapter(editingChapter.id!, {
          title: editingChapter.title || "",
          content: editingChapter.content || "",
          status: editingChapter.status as "published" | "draft",
          order: editingChapter.order || 0
        });
        
        setChapters(chapters.map(ch => ch.id === updatedChapter.id ? updatedChapter : ch));
        toast({
          title: "تم حفظ الفصل",
          description: "تم حفظ التغييرات بنجاح",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ في حفظ البيانات",
        description: "حدث خطأ أثناء محاولة حفظ الفصل. يرجى المحاولة مرة أخرى.",
      });
      console.error("خطأ في حفظ الفصل:", error);
    } finally {
      setEditingChapter(null);
      setIsNewChapter(false);
    }
  };

  const handleAddChapter = () => {
    const newOrder = chapters.length > 0 
      ? Math.max(...chapters.map(ch => ch.order)) + 1 
      : 1;
      
    setEditingChapter({
      novel_id: novelId,
      title: `الفصل ${newOrder}: `,
      order: newOrder,
      content: "",
      status: "draft"
    });
    setIsNewChapter(true);
  };

  const handleEditChapter = (chapter: Chapter) => {
    setEditingChapter({ ...chapter });
    setIsNewChapter(false);
  };

  const handleDeleteChapter = async (id: string) => {
    try {
      await deleteChapter(id);
      setChapters(chapters.filter(ch => ch.id !== id));
      toast({
        title: "تم حذف الفصل",
        description: "تم حذف الفصل بنجاح",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ في الحذف",
        description: "حدث خطأ أثناء محاولة حذف الفصل. يرجى المحاولة مرة أخرى.",
      });
      console.error("خطأ في حذف الفصل:", error);
    } finally {
      setDeleteDialog(null);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: "published" | "draft") => {
    try {
      const updatedChapter = await updateChapterStatus(id, newStatus);
      setChapters(chapters.map(ch => ch.id === id ? updatedChapter : ch));
      toast({
        title: newStatus === "published" ? "تم نشر الفصل" : "تم تحويل الفصل إلى مسودة",
        description: "تم تحديث حالة الفصل بنجاح",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ في تغيير الحالة",
        description: "حدث خطأ أثناء محاولة تغيير حالة الفصل. يرجى المحاولة مرة أخرى.",
      });
      console.error("خطأ في تغيير حالة الفصل:", error);
    }
  };

  const handleMoveChapter = async (id: string, direction: "up" | "down") => {
    const chapterIndex = chapters.findIndex(ch => ch.id === id);
    if (
      (direction === "up" && chapterIndex === 0) || 
      (direction === "down" && chapterIndex === chapters.length - 1)
    ) {
      return;
    }

    const newChapters = [...chapters];
    const otherIndex = direction === "up" ? chapterIndex - 1 : chapterIndex + 1;
    
    // تبديل الترتيب
    const currentOrder = newChapters[chapterIndex].order;
    newChapters[chapterIndex].order = newChapters[otherIndex].order;
    newChapters[otherIndex].order = currentOrder;
    
    try {
      // تحديث الفصل الأول
      await updateChapter(newChapters[chapterIndex].id, {
        title: newChapters[chapterIndex].title,
        content: newChapters[chapterIndex].content,
        status: newChapters[chapterIndex].status,
        order: newChapters[chapterIndex].order
      });
      
      // تحديث الفصل الثاني
      await updateChapter(newChapters[otherIndex].id, {
        title: newChapters[otherIndex].title,
        content: newChapters[otherIndex].content,
        status: newChapters[otherIndex].status,
        order: newChapters[otherIndex].order
      });
      
      // إعادة ترتيب المصفوفة
      newChapters.sort((a, b) => a.order - b.order);
      setChapters(newChapters);
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ في تغيير الترتيب",
        description: "حدث خطأ أثناء محاولة تغيير ترتيب الفصول. يرجى المحاولة مرة أخرى.",
      });
      console.error("خطأ في تغيير ترتيب الفصول:", error);
    }
  };

  if (loading) {
    return <div className="py-8 text-center">جاري تحميل البيانات...</div>;
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-heading font-bold text-mihrab">
            فصول الرواية
          </h2>
          <Button
            className="bg-mihrab hover:bg-mihrab-dark"
            onClick={handleAddChapter}
          >
            إضافة فصل جديد
          </Button>
        </div>

        {chapters.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">لا توجد فصول حالياً. أضف فصلاً جديداً للبدء.</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead>عنوان الفصل</TableHead>
                  <TableHead className="w-24 text-center">الحالة</TableHead>
                  <TableHead className="w-48 text-center">الترتيب</TableHead>
                  <TableHead className="w-48 text-center">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chapters.map((chapter) => (
                  <TableRow key={chapter.id}>
                    <TableCell className="text-center">{chapter.order}</TableCell>
                    <TableCell>{chapter.title}</TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          chapter.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {chapter.status === "published" ? "منشور" : "مسودة"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleMoveChapter(chapter.id, "up")}
                          disabled={chapter.order === 1}
                        >
                          ▲
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleMoveChapter(chapter.id, "down")}
                          disabled={chapter.order === chapters.length}
                        >
                          ▼
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditChapter(chapter)}
                        >
                          تعديل
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => setDeleteDialog(chapter.id)}
                        >
                          حذف
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleUpdateStatus(
                              chapter.id,
                              chapter.status === "published" ? "draft" : "published"
                            )
                          }
                        >
                          {chapter.status === "published" ? "تعطيل" : "نشر"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* محرر الفصل */}
      {editingChapter && (
        <Dialog open={!!editingChapter} onOpenChange={() => setEditingChapter(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {isNewChapter ? "إضافة فصل جديد" : "تحرير الفصل"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">عنوان الفصل</label>
                  <Input
                    value={editingChapter.title || ""}
                    onChange={(e) =>
                      setEditingChapter({ ...editingChapter, title: e.target.value })
                    }
                    placeholder="أدخل عنوان الفصل"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">الحالة</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={editingChapter.status || "draft"}
                    onChange={(e) =>
                      setEditingChapter({
                        ...editingChapter,
                        status: e.target.value as "published" | "draft",
                      })
                    }
                  >
                    <option value="published">منشور</option>
                    <option value="draft">مسودة</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">محتوى الفصل</label>
                <Textarea
                  className="min-h-[300px] font-arabic"
                  value={editingChapter.content || ""}
                  onChange={(e) =>
                    setEditingChapter({ ...editingChapter, content: e.target.value })
                  }
                  placeholder="أدخل محتوى الفصل هنا..."
                />
              </div>
            </div>

            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setEditingChapter(null)}>
                إلغاء
              </Button>
              <Button onClick={handleSaveChapter} className="bg-mihrab hover:bg-mihrab-dark">
                {isNewChapter ? "إضافة الفصل" : "حفظ التغييرات"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* تأكيد الحذف */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
          </DialogHeader>
          <p>هل أنت متأكد من رغبتك في حذف هذا الفصل؟ هذا الإجراء لا يمكن التراجع عنه.</p>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteDialog && handleDeleteChapter(deleteDialog)}
            >
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChapterEditor;
