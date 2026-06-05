import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import { revalidatePath } from "next/cache";
import BlogsClient from "./blogs-client";

// --- SERVER ACTIONS ---
export async function deleteBlog(id: number) {
  "use server";
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");
  await pool.query('DELETE FROM blogs WHERE id = ?', [id]);
  revalidatePath('/admin/blogs');
  revalidatePath('/blog');
}

export async function saveBlog(data: any) {
  "use server";
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");

  const { id, title, slug, description, image, category, author, publishDate, readTime, content } = data;
  
  if (id) {
    await pool.query(`
      UPDATE blogs SET 
        title=?, slug=?, description=?, image=?, category=?, author=?, publishDate=?, readTime=?, content=?
      WHERE id=?
    `, [title, slug, description, image, category, author, publishDate, readTime, content, id]);
  } else {
    await pool.query(`
      INSERT INTO blogs 
      (title, slug, description, image, category, author, publishDate, readTime, content, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `, [title, slug, description, image, category, author, publishDate || new Date().toISOString().split('T')[0], readTime || 5, content || '']);
  }
  
  revalidatePath('/admin/blogs');
  revalidatePath('/blog');
}

export default async function AdminBlogsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    redirect("/");
  }

  const [rows] = await pool.query('SELECT * FROM blogs ORDER BY id DESC');
  const blogs = rows as any[];

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-[#0a0a0a]">Blog Management</h1>
          <p className="text-gray-500">Add, update, and remove articles from the journal.</p>
        </div>
      </div>

      <BlogsClient initialBlogs={blogs} saveAction={saveBlog} deleteAction={deleteBlog} />
    </div>
  );
}
