import { notFound, redirect } from "next/navigation";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import Link from "next/link";
import { Package, Check, ChevronRight } from "lucide-react";
import PackageCard from "@/components/packages/PackageCard";
import PackageCardWrapper from "../../../components/packages/PackageCardWrapper";

export async function generateStaticParams() {
  const [rows] = await pool.query('SELECT slug FROM packages WHERE is_active = 1');
  return (rows as any[]).map((pkg) => ({ slug: pkg.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const [rows] = await pool.query('SELECT * FROM packages WHERE slug = ? AND is_active = 1', [decodedSlug]);
  const packages = rows as any[];
  const pkg = packages.length > 0 ? packages[0] : null;
  
  if (!pkg) return { title: "Package Not Found" };

  const title = pkg.seo_title || `${pkg.name} — Package Deal | Octane Powersports`;
  const description = pkg.seo_description || `Save on the ${pkg.name}. Curated bundle of premium products for your superbike.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://octanepowersports.in/packages/${pkg.slug}`,
      images: pkg.banner ? [{ url: pkg.banner, width: 1200, height: 600, alt: pkg.name }] : [],
      type: "website",
    },
    alternates: {
      canonical: `https://octanepowersports.in/packages/${pkg.slug}`
    }
  };
}

export default async function PackagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  // Fetch package
  const [packageRows] = await pool.query<RowDataPacket[]>(`
    SELECT p.* 
    FROM packages p
    WHERE p.slug = ? AND p.is_active = 1
  `, [decodedSlug]);

  if (packageRows.length === 0) {
    const strippedSlug = decodedSlug.replace(/[^a-zA-Z0-9]/g, '%').replace(/%+/g, '%');
    const aggressivePattern = `%${strippedSlug}%`;
    const [fallbackRows] = await pool.query<RowDataPacket[]>(`
      SELECT slug FROM packages WHERE (slug LIKE ? OR name LIKE ?) AND is_active = 1 LIMIT 1
    `, [aggressivePattern, aggressivePattern]);
    
    if (fallbackRows.length > 0) {
      redirect(`/packages/${fallbackRows[0].slug}`);
    } else {
      notFound();
    }
  }

  const pkg = packageRows[0];

  // Fetch products
  const [productsRows] = await pool.query<RowDataPacket[]>(`
    SELECT p.id, p.name, p.slug, p.price, p.image, p.stockCount, p.availability, p.description
    FROM package_products pp
    JOIN products p ON pp.product_id = p.id
    WHERE pp.package_id = ?
    ORDER BY pp.sort_order ASC
  `, [pkg.id]);

  pkg.products = productsRows;

  // Fetch related packages
  const [relatedRows] = await pool.query<RowDataPacket[]>(`
    SELECT p.* 
    FROM packages p
    WHERE p.id != ? AND p.is_active = 1
    ORDER BY p.priority DESC LIMIT 3
  `, [pkg.id]);

  const relatedPackages = relatedRows;
  if (relatedPackages.length > 0) {
    const relatedIds = relatedPackages.map(p => p.id);
    const [relatedProducts] = await pool.query<RowDataPacket[]>(`
      SELECT pp.package_id, p.id, p.name, p.slug, p.price, p.image, p.stockCount, p.availability
      FROM package_products pp
      JOIN products p ON pp.product_id = p.id
      WHERE pp.package_id IN (?)
      ORDER BY pp.sort_order ASC
    `, [relatedIds]);

    const productsByPackageId = (relatedProducts as any[]).reduce((acc, row) => {
      if (!acc[row.package_id]) acc[row.package_id] = [];
      acc[row.package_id].push(row);
      return acc;
    }, {});

    for (const rpkg of relatedPackages) {
      rpkg.products = productsByPackageId[rpkg.id] || [];
    }
  }

  return (
    <main className="bg-[#f8f8f8] min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-4 px-6 md:px-12 flex items-center gap-2 text-sm text-gray-500 font-bold uppercase tracking-wider">
        <Link href="/" className="hover:text-[#ff6b00] transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link href="/shop" className="hover:text-[#ff6b00] transition-colors">Packages</Link>
        <ChevronRight size={14} />
        <span className="text-[#0a0a0a]">{pkg.name}</span>
      </div>

      <div className="container mx-auto px-6 py-12 lg:py-20 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Banner */}
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-gray-100">
              {pkg.banner ? (
                <img src={pkg.banner} alt={pkg.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <Package size={64} className="text-gray-400" />
                </div>
              )}
              {pkg.discount_type === 'percentage' && (
                <div className="absolute top-6 right-6 bg-[#ff6b00] text-white px-6 py-2 rounded-full text-lg font-black uppercase tracking-wider shadow-lg transform rotate-3">
                  Save {pkg.discount_value}%
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-tight text-[#0a0a0a] mb-6">
                {pkg.name}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
                {pkg.description}
              </p>
            </div>

            {/* Included Products */}
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-[#0a0a0a] mb-8 flex items-center gap-4">
                What's Included
                <span className="bg-[#ff6b00] text-white text-sm px-3 py-1 rounded-full">{pkg.products.length} Items</span>
              </h2>
              
              <div className="space-y-4">
                {pkg.products.map((product: any, index: number) => (
                  <Link href={`/product/${product.slug}`} key={product.id} className="block group">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-6">
                      <div className="font-black text-gray-200 text-3xl hidden md:block">{(index + 1).toString().padStart(2, '0')}</div>
                      
                      <div className="w-24 h-24 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 flex-shrink-0 relative group-hover:scale-105 transition-transform">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package size={32} className="text-gray-300" />
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#0a0a0a] group-hover:text-[#ff6b00] transition-colors mb-2">{product.name}</h3>
                        <p className="text-sm text-gray-500 line-clamp-2">{product.description || "Premium product for your superbike."}</p>
                      </div>

                      <div className="text-right">
                        <p className="text-xl font-black text-[#0a0a0a]">₹{product.price}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar CTA */}
          <div className="lg:col-span-4">
            <div className="sticky top-[110px] space-y-6">
              {/* Checkout Card */}
              <div className="bg-[#0a0a0a] text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff6b00] rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                
                <h3 className="text-2xl font-black uppercase tracking-tight mb-8">Package Summary</h3>
                
                <div className="space-y-4 mb-8">
                  {pkg.products.map((p: any) => (
                    <Link href={`/product/${p.slug}`} key={p.id} className="flex justify-between text-sm text-gray-400 hover:text-[#ff6b00] transition-colors cursor-pointer group">
                      <span className="truncate pr-4 group-hover:underline">{p.name}</span>
                      <span>₹{p.price}</span>
                    </Link>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-6 mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 font-bold">Original Value</span>
                    <span className="text-lg line-through text-gray-500">
                      ₹{pkg.products.reduce((acc: number, p: any) => acc + Number(p.price), 0).toFixed(2)}
                    </span>
                  </div>
                  
                  {pkg.discount_type === 'percentage' ? (
                    <div className="flex justify-between items-center mb-6 text-[#ff6b00]">
                      <span className="font-bold">Package Discount ({pkg.discount_value}%)</span>
                      <span className="font-black">-₹{((pkg.products.reduce((acc: number, p: any) => acc + Number(p.price), 0) * Number(pkg.discount_value)) / 100).toFixed(2)}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center mb-6 text-[#ff6b00]">
                      <span className="font-bold">Package Savings</span>
                      <span className="font-black">-₹{Number(pkg.discount_value).toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-end">
                    <span className="text-xl font-bold">Total Price</span>
                    <span className="text-4xl font-black text-[#ff6b00]">
                      ₹{Math.max(0, pkg.products.reduce((acc: number, p: any) => acc + Number(p.price), 0) - (pkg.discount_type === 'percentage' ? (pkg.products.reduce((acc: number, p: any) => acc + Number(p.price), 0) * Number(pkg.discount_value)) / 100 : Number(pkg.discount_value))).toFixed(2)}
                    </span>
                  </div>
                </div>

                <PackageCardWrapper pkg={pkg} />

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <Check size={16} className="text-[#ff6b00]" /> 100% Genuine Direct Import
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Related Packages */}
        {relatedPackages.length > 0 && (
          <div className="mt-24 pt-12 border-t border-gray-200">
            <div className="text-center mb-12">
              <p className="eyebrow text-[#ff6b00]">More Offers</p>
              <h2 className="text-4xl font-black uppercase tracking-tight text-[#0a0a0a]">Related Packages</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPackages.map((p) => (
                <div key={p.id}>
                  <PackageCard pkg={p} />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

