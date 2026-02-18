import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlogContent from "@/components/sections/BlogContent";

export default function BlogPage() {
    return (
        <>
            <Navbar />
            <main className="pt-24">
                <BlogContent />
            </main>
            <Footer />
        </>
    );
}
