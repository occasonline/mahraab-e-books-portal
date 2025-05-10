
import { useState } from "react";
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

interface Chapter {
  id: string;
  title: string;
  order: number;
  content: string;
  status: "published" | "draft";
}

// بيانات مؤقتة للفصول - سيتم استبدالها بالبيانات من قاعدة البيانات لاحقًا
const MOCK_CHAPTERS: Chapter[] = [
  {
    id: "ch1",
    title: "الفصل الأول: الظلام",
    order: 1,
    content: "استيقظ «سالم» على صوت المنبه المزعج كعادته كل صباح. لكن هذا الصباح كان مختلفاً. شعر بثقل غريب في صدره، وكأن هناك جبلاً جاثماً عليه...",
    status: "published"
  },
  {
    id: "ch2",
    title: "الفصل الثاني: الضوء",
    order: 2,
    content: "لم يكن سالم يعلم أن حياته ستتغير بهذه السرعة. مرت أسابيع وهو يتردد على حلقات الذكر في المسجد القديم...",
    status: "published"
  },
  {
    id: "ch3",
    title: "الفصل الثالث: الرحلة",
    order: 3,
    content: "قرر سالم أن يبدأ رحلته في طلب المعرفة. جمع أغراضه البسيطة وودع عائلته...",
    status: "draft"
  },
];

interface ChapterEditorProps {
  novelId: string;
}

const ChapterEditor = ({ novelId }: ChapterEditorProps) => {
  const { toast } = useToast();
  const [chapters, setChapters] = useState<Chapter[]>(MOCK_CHAPTERS);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [isNewChapter, setIsNewChapter] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);

  const handleSaveChapter = () => {
    if (!editingChapter) return;

    // في النسخة الحقيقية، سنرسل طلب API لحفظ الفصل
    if (isNewChapter) {
      setChapters([...chapters, { ...editingChapter, id: `ch${Date.now()}` }]);
      toast({
        title: "تمت إضافة الفصل",
        description: "تم إضافة الفصل الجديد بنجاح",
      });
    } else {
      setChapters(chapters.map(ch => ch.id === editingChapter.id ? editingChapter : ch));
      toast({
        title: "تم حفظ الفصل",
        description: "تم حفظ التغييرات بنجاح",
      });
    }
    
    setEditingChapter(null);
    setIsNewChapter(false);
  };

  const handleAddChapter = () => {
    const newOrder = chapters.length > 0 
      ? Math.max(...chapters.map(ch => ch.order)) + 1 
      : 1;
      
    setEditingChapter({
      id: "new",
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

  const handleDeleteChapter = (id: string) => {
    // في النسخة الحقيقية، سنرسل طلب API لحذف الفصل
    setChapters(chapters.filter(ch => ch.id !== id));
    setDeleteDialog(null);
    toast({
      title: "تم حذف الفصل",
      description: "تم حذف الفصل بنجاح",
    });
  };

  const handleUpdateStatus = (id: string, newStatus: "published" | "draft") => {
    // في النسخة الحقيقية، سنرسل طلب API لتحديث حالة الفصل
    setChapters(chapters.map(ch => 
      ch.id === id ? { ...ch, status: newStatus } : ch
    ));
    toast({
      title: newStatus === "published" ? "تم نشر الفصل" : "تم تحويل الفصل إلى مسودة",
      description: "تم تحديث حالة الفصل بنجاح",
    });
  };

  const handleMoveChapter = (id: string, direction: "up" | "down") => {
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
    
    // إعادة ترتيب المصفوفة
    newChapters.sort((a, b) => a.order - b.order);
    
    setChapters(newChapters);
  };

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
                    value={editingChapter.title}
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
                    value={editingChapter.status}
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
                  value={editingChapter.content}
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
