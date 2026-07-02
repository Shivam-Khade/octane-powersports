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

function sanitizeSlug(s: string) {
  return (s || "").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export async function saveBlog(data: any) {
  "use server";
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");

  const { id, title, slug, description, image, category, author, publishDate, readTime, content, introText, quoteText, subHeading, bodyText } = data;
  
  const cleanSlug = sanitizeSlug(slug);
  
  if (id) {
    await pool.query(`
      UPDATE blogs SET 
        title=?, slug=?, description=?, image=?, category=?, author=?, publishDate=?, readTime=?, content=?, introText=?, quoteText=?, subHeading=?, bodyText=?
      WHERE id=?
    `, [title, cleanSlug, description, image, category, author, publishDate, readTime, content, introText, quoteText, subHeading, bodyText, id]);
  } else {
    await pool.query(`
      INSERT INTO blogs 
      (title, slug, description, image, category, author, publishDate, readTime, content, featured, introText, quoteText, subHeading, bodyText)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?)
    `, [title, cleanSlug, description, image, category, author, publishDate || new Date().toISOString().split('T')[0], readTime || 5, content || '', introText || '', quoteText || '', subHeading || '', bodyText || '']);
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
          <p className="text-gray-500">Add, update, and remove articles from the blog.</p>
        </div>
      </div>

      <BlogsClient initialBlogs={blogs} saveAction={saveBlog} deleteAction={deleteBlog} />
    </div>
  );
}
