export interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    tags: string[];
    readTime: string;
    author: string;
    authorRole: string;
    date: string;
    reads: number;
    favorites: number;
    imageBg: string;
    content: {
        type: "paragraph" | "heading" | "blockquote" | "chart" | "image" | "table";
        text?: string;
        cite?: string;
        rows?: string[][];
    }[];
    recommended: { slug: string; title: string; icon: string }[];
    sidebar: { heading: string; description: string; cta: string };
}

export const blogPosts: BlogPost[] = [
    {
        slug: "cracking-the-berlin-marathon-course",
        title: "Breaking the 2:00 Barrier: Lessons from Berlin",
        excerpt:
            "Master the nuances of the world's fastest course. Learn where to conserve energy and exactly when to push for a record-breaking finish.",
        tags: ["Course Strategy", "PB Chasing"],
        readTime: "5 min read",
        author: "Dr. Elias Vance",
        authorRole: "Sports Scientist",
        date: "Oct 12, 2024",
        reads: 12480,
        favorites: 843,
        imageBg: "from-sky-700 via-indigo-600 to-blue-800",
        content: [
            {
                type: "paragraph",
                text: "Human performance has long been defined by limits we thought were unbreakable. The sub-two-hour marathon wasn't just a physical barrier; it was a psychological ceiling that required the perfect alignment of environment, technology, and sheer human will.",
            },
            { type: "heading", text: "The Anatomy of the Berlin Course" },
            {
                type: "paragraph",
                text: "The Berlin Marathon is legendary for its speed. Unlike the rolling hills of Boston or the sharp turns of London, Berlin offers a flat, sea-level profile that minimizes physiological cost per kilometer. Our data scientists at RunGen have analysed over 50,000 GPS finishes in collaboration with university research labs to understand why marathon times here trend 3-4% faster than anywhere else.",
            },
            { type: "chart", text: "Elevation Profile" },
            { type: "heading", text: "Optimal Pacing Strategy" },
            {
                type: "paragraph",
                text: 'The data suggests that the "Negative Split" remains the gold standard. Breaking 2:00 requires an opening half of roughly 59:50, followed by a slight acceleration in the final 10km. This demands an incredible aerobic capacity and a metabolic efficiency that only the world\'s most elite athletes possess.',
            },
            {
                type: "blockquote",
                text: '"The limit is not in the legs, but in the mind\'s ability to process the pain of a 2:50 min/km pace for two straight hours."',
                cite: "Dr. A. Kiplagat",
            },
            { type: "heading", text: "The Tech Stack: Carbon & Gels" },
            {
                type: "paragraph",
                text: "We cannot discuss Berlin without the shoes. The evolution of carbon-fiber plate technology has resulted in a 4% improvement in running economy. When combined with advanced hydrogel nutrition strategies, runners can maintain glycogen levels deeper into the race than ever before.",
            },
            { type: "heading", text: "Conclusion: Your Own Barrier" },
            {
                type: "paragraph",
                text: "While you may not be chasing a sub-2:00 marathon, the lessons from Berlin apply to every runner. Pacing discipline, course analysis, and technological optimization are the pillars of performance. At RunGen AI, we build every training plan with these principles at the core.",
            },
            {
                type: "table",
                text: "Berlin World Record Splits",
                rows: [
                    ["5K", "14:14"],
                    ["10K", "28:23"],
                    ["15K", "42:33"],
                    ["20K", "56:45"],
                    ["25K", "1:11:08"],
                    ["30K", "1:25:29"],
                    ["35K", "1:39:43"],
                    ["40K", "1:54:02"],
                    ["Finish", "2:00:35"],
                ],
            },
        ],
        recommended: [
            {
                slug: "science-of-the-taper",
                title: "The Carbon Plate Revolution: 2024 Shoe Guide",
                icon: "👟",
            },
            {
                slug: "science-of-the-taper",
                title: "Elite Recovery: 5 Secrets from Olympic Camps",
                icon: "🏥",
            },
            {
                slug: "nutrition-strategies-abbott-six",
                title: "Fueling for the Wall: New Glucose Strategies",
                icon: "⚡",
            },
        ],
        sidebar: {
            heading: "Ready to beat your PR?",
            description:
                "Get the same data & AI-driven insights used by elite runners. Start your personalized RunGen AI plan today.",
            cta: "Start Your Free Trial",
        },
    },
    {
        slug: "science-of-the-taper",
        title: "The Science of the Taper for World Majors",
        excerpt:
            "The most critical phase of training. Balancing recovery and neuro-muscular intensity in the final 21 days before your big race.",
        tags: ["Physiology", "Performance"],
        readTime: "7 min read",
        author: "Coach Sarah Jenkins",
        authorRole: "Head Coach",
        date: "Oct 08, 2024",
        reads: 9340,
        favorites: 621,
        imageBg: "from-amber-700 via-orange-600 to-yellow-600",
        content: [
            {
                type: "paragraph",
                text: "The taper phase is arguably the most misunderstood and anxiety-inducing period in any marathon training cycle. After months of building fitness, the idea of deliberately reducing volume feels counterintuitive. Yet the science is unequivocal: a well-executed taper can improve race-day performance by 2-6%.",
            },
            { type: "heading", text: "The Science Behind the Taper" },
            {
                type: "paragraph",
                text: "During a taper, your body undergoes a remarkable transformation. Muscle glycogen stores supercompensate by up to 25%. Damaged muscle fibers complete their repair cycle. Hormonal markers of stress—cortisol, creatine kinase—return to baseline. Meanwhile, your neuromuscular system retains the high-frequency firing patterns developed during peak training.",
            },
            { type: "heading", text: "The 21-Day Protocol" },
            {
                type: "paragraph",
                text: "Research from the University of Sherbrooke suggests a progressive taper of approximately 40-60% volume reduction over three weeks, while maintaining intensity at 90% of peak. This protocol preserves the sharpness of your speed work while allowing deep physiological recovery.",
            },
            {
                type: "blockquote",
                text: '"The hay is in the barn. Your only job during taper is to not burn it."',
                cite: "Renato Canova",
            },
            { type: "heading", text: "Common Taper Mistakes" },
            {
                type: "paragraph",
                text: "The biggest mistake runners make is compensating for reduced volume with increased intensity. This leads to 'taper tantrums'—the psychological panic that makes athletes add extra sessions. Trust the process. Your fitness won't disappear in three weeks, but your fatigue will.",
            },
            { type: "heading", text: "Race Week: The Final 7 Days" },
            {
                type: "paragraph",
                text: "In the final week, reduce volume to 30% of peak. Include two short shakeout runs with 4-5 race-pace strides. Focus on sleep quality, hydration, and carbohydrate loading. Your body is a finely tuned engine—give it the premium fuel it deserves.",
            },
        ],
        recommended: [
            { slug: "cracking-the-berlin-marathon-course", title: "Breaking the 2:00 Barrier", icon: "🏁" },
            { slug: "nutrition-strategies-abbott-six", title: "Nutrition Strategies for the Abbott Six", icon: "🥗" },
        ],
        sidebar: {
            heading: "Ready to beat your PR?",
            description: "Get the same data & AI-driven insights used by elite runners.",
            cta: "Start Your Free Trial",
        },
    },
    {
        slug: "nutrition-strategies-abbott-six",
        title: "Nutrition Strategies for the Abbott Six",
        excerpt:
            "Navigating fueling across global climates. From the humidity of Tokyo to the unpredictable chill of Boston's Newton Hills.",
        tags: ["Fueling", "World Majors"],
        readTime: "6 min read",
        author: "Mark Thompson, RD",
        authorRole: "Sports Dietitian",
        date: "Sep 29, 2024",
        reads: 7850,
        favorites: 512,
        imageBg: "from-purple-900 via-violet-800 to-indigo-800",
        content: [
            {
                type: "paragraph",
                text: "Each of the Abbott World Marathon Majors presents a unique nutritional challenge. Temperature, humidity, elevation, and course profile all influence your fueling strategy. A plan that works in cool, flat Berlin will fail spectacularly in humid Tokyo or hilly Boston.",
            },
            { type: "heading", text: "Tokyo: Battling Humidity" },
            {
                type: "paragraph",
                text: "The Tokyo Marathon in early March can see humidity levels above 70%. This dramatically increases sweat rate and sodium loss. Our data shows that runners who increase sodium intake by 30% in the 48 hours before Tokyo experience 15% fewer instances of cramping after the 30km mark.",
            },
            { type: "heading", text: "Boston: The Newton Hills Factor" },
            {
                type: "paragraph",
                text: "Boston's famously late hills between 26-32km demand a front-loaded fueling strategy. By the time you hit Heartbreak Hill, your gut's ability to absorb carbohydrate drops significantly. Take your final gel no later than 25km.",
            },
            {
                type: "blockquote",
                text: '"Nothing new on race day—except maybe an extra pinch of salt for Tokyo."',
                cite: "Mark Thompson, RD",
            },
            { type: "heading", text: "The Universal Fueling Protocol" },
            {
                type: "paragraph",
                text: "Despite the differences, core principles remain constant: 60-90g of carbohydrate per hour, dual-source glucose-fructose formulations, and practicing your exact race-day nutrition during at least three long runs. At RunGen AI, your nutrition plan adapts to the specific climate and course of your target race.",
            },
        ],
        recommended: [
            { slug: "cracking-the-berlin-marathon-course", title: "Breaking the 2:00 Barrier", icon: "🏁" },
            { slug: "science-of-the-taper", title: "The Science of the Taper", icon: "📉" },
        ],
        sidebar: {
            heading: "Ready to beat your PR?",
            description: "Get the same data & AI-driven insights used by elite runners.",
            cta: "Start Your Free Trial",
        },
    },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
    return blogPosts.find((p) => p.slug === slug);
}
