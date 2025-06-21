"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Clock,
  Users,
  Award,
  Star,
  Target,
  CheckCircle,
  ArrowRight,
  Code,
  Database,
  Shield,
  BarChart3,
  DollarSign,
  TrendingUp,
  X,
} from "lucide-react"
import Link from "next/link"

interface CourseData {
  id: string
  title: string
  description: string
  longDescription: string
  icon: any
  duration: string
  students: string
  level: string
  skills: string[]
  color: string
  instructor: {
    name: string
    title: string
    experience: string
    rating: number
    students: number
    image: string
    bio: string
  }
  curriculum: {
    week: number
    title: string
    topics: string[]
    project?: string
  }[]
  outcomes: string[]
  requirements: string[]
  schedule: {
    format: string
    duration: string
    commitment: string
    startDate: string
  }
  pricing: {
    original: number
    current: number
    installments: boolean
  }
  certification: {
    type: string
    accredited: boolean
    industry: string[]
  }
  jobOutcomes: {
    averageSalary: string
    placementRate: string
    topCompanies: string[]
  }
}

const courseData: Record<string, CourseData> = {
  cybersecurity: {
    id: "cybersecurity",
    title: "Cybersecurity Specialist",
    description: "Master the art of digital defense and ethical hacking",
    longDescription:
      "Become a cybersecurity expert with our comprehensive program covering penetration testing, network security, incident response, and risk assessment. Learn from industry professionals and gain hands-on experience with real-world scenarios.",
    icon: Shield,
    duration: "12 weeks",
    students: "150+",
    level: "Intermediate",
    skills: [
      "Penetration Testing",
      "Network Security",
      "Incident Response",
      "Risk Assessment",
      "Ethical Hacking",
      "Compliance",
    ],
    color: "from-red-500 to-orange-500",
    instructor: {
      name: "Sarah Chen",
      title: "Senior Cybersecurity Consultant",
      experience: "8+ years",
      rating: 4.9,
      students: 500,
      image: "/placeholder.svg?height=100&width=100",
      bio: "Former security architect at Fortune 500 companies with expertise in threat hunting and incident response. Certified CISSP and CEH with a passion for teaching the next generation of cybersecurity professionals.",
    },
    curriculum: [
      {
        week: 1,
        title: "Cybersecurity Fundamentals",
        topics: ["Security Principles", "Threat Landscape", "Risk Management", "Security Frameworks"],
        project: "Security Assessment Report",
      },
      {
        week: 2,
        title: "Network Security",
        topics: ["Firewalls", "IDS/IPS", "VPN Technologies", "Network Monitoring"],
        project: "Network Security Design",
      },
      {
        week: 3,
        title: "Ethical Hacking & Penetration Testing",
        topics: ["Reconnaissance", "Vulnerability Assessment", "Exploitation", "Post-Exploitation"],
        project: "Penetration Test Report",
      },
      {
        week: 4,
        title: "Incident Response & Forensics",
        topics: ["Incident Handling", "Digital Forensics", "Malware Analysis", "Recovery Procedures"],
        project: "Incident Response Plan",
      },
    ],
    outcomes: [
      "Conduct comprehensive security assessments",
      "Implement network security solutions",
      "Perform ethical hacking and penetration testing",
      "Develop incident response procedures",
      "Ensure compliance with security standards",
      "Analyze and respond to security threats",
    ],
    requirements: [
      "Basic understanding of networking concepts",
      "Familiarity with operating systems (Windows/Linux)",
      "Strong analytical and problem-solving skills",
      "Interest in cybersecurity and ethical hacking",
    ],
    schedule: {
      format: "Hybrid (Online + Lab Sessions)",
      duration: "12 weeks",
      commitment: "15-20 hours/week",
      startDate: "Every month",
    },
    pricing: {
      original: 2999,
      current: 1999,
      installments: true,
    },
    certification: {
      type: "Professional Certificate",
      accredited: true,
      industry: ["CompTIA Security+", "CEH", "CISSP"],
    },
    jobOutcomes: {
      averageSalary: "$85,000 - $120,000",
      placementRate: "94%",
      topCompanies: ["Microsoft", "IBM", "Cisco", "Palo Alto Networks"],
    },
  },
  fullstack: {
    id: "fullstack",
    title: "Full Stack Development",
    description: "Build end-to-end web applications with modern technologies",
    longDescription:
      "Master both frontend and backend development with our comprehensive full-stack program. Learn React, Node.js, databases, and cloud deployment while building real-world applications that showcase your skills to potential employers.",
    icon: Code,
    duration: "16 weeks",
    students: "200+",
    level: "Beginner to Advanced",
    skills: ["React/Next.js", "Node.js", "Database Design", "Cloud Deployment", "API Development", "DevOps"],
    color: "from-blue-500 to-cyan-500",
    instructor: {
      name: "Marcus Rodriguez",
      title: "Senior Full Stack Engineer",
      experience: "10+ years",
      rating: 4.8,
      students: 750,
      image: "/placeholder.svg?height=100&width=100",
      bio: "Lead developer at multiple startups and tech companies. Expert in modern JavaScript frameworks and cloud architecture. Passionate about mentoring developers and building scalable applications.",
    },
    curriculum: [
      {
        week: 1,
        title: "Frontend Fundamentals",
        topics: ["HTML5", "CSS3", "JavaScript ES6+", "Responsive Design"],
        project: "Responsive Portfolio Website",
      },
      {
        week: 2,
        title: "React Development",
        topics: ["Components", "State Management", "Hooks", "Context API"],
        project: "Interactive Web Application",
      },
      {
        week: 3,
        title: "Backend Development",
        topics: ["Node.js", "Express.js", "RESTful APIs", "Authentication"],
        project: "API Server with Authentication",
      },
      {
        week: 4,
        title: "Database & Deployment",
        topics: ["MongoDB", "PostgreSQL", "Cloud Deployment", "CI/CD"],
        project: "Full-Stack E-commerce Platform",
      },
    ],
    outcomes: [
      "Build responsive web applications",
      "Develop RESTful APIs and microservices",
      "Implement database solutions",
      "Deploy applications to cloud platforms",
      "Work with modern development tools",
      "Collaborate using Git and version control",
    ],
    requirements: [
      "Basic computer literacy",
      "Logical thinking and problem-solving skills",
      "Commitment to learning and practice",
      "No prior programming experience required",
    ],
    schedule: {
      format: "Online with Live Sessions",
      duration: "16 weeks",
      commitment: "20-25 hours/week",
      startDate: "Bi-weekly",
    },
    pricing: {
      original: 3499,
      current: 2299,
      installments: true,
    },
    certification: {
      type: "Professional Certificate",
      accredited: true,
      industry: ["AWS", "Google Cloud", "Microsoft Azure"],
    },
    jobOutcomes: {
      averageSalary: "$75,000 - $110,000",
      placementRate: "96%",
      topCompanies: ["Google", "Meta", "Netflix", "Shopify"],
    },
  },
  datascience: {
    id: "datascience",
    title: "Data Science & AI",
    description: "Extract insights from data using machine learning and AI",
    longDescription:
      "Become a data scientist with our comprehensive program covering Python, machine learning, statistical analysis, and data visualization. Work on real datasets and build predictive models that solve business problems.",
    icon: BarChart3,
    duration: "14 weeks",
    students: "120+",
    level: "Intermediate",
    skills: [
      "Python/R",
      "Machine Learning",
      "Statistical Analysis",
      "Data Visualization",
      "Deep Learning",
      "AI Ethics",
    ],
    color: "from-green-500 to-emerald-500",
    instructor: {
      name: "Dr. Priya Patel",
      title: "Lead Data Scientist",
      experience: "12+ years",
      rating: 4.9,
      students: 400,
      image: "/placeholder.svg?height=100&width=100",
      bio: "PhD in Machine Learning with extensive experience in AI research and industry applications. Former data science lead at tech unicorns, specializing in predictive modeling and AI ethics.",
    },
    curriculum: [
      {
        week: 1,
        title: "Data Science Foundations",
        topics: ["Python Programming", "Statistics", "Data Manipulation", "Pandas & NumPy"],
        project: "Exploratory Data Analysis",
      },
      {
        week: 2,
        title: "Machine Learning",
        topics: ["Supervised Learning", "Unsupervised Learning", "Model Evaluation", "Feature Engineering"],
        project: "Predictive Model Development",
      },
      {
        week: 3,
        title: "Deep Learning & AI",
        topics: ["Neural Networks", "TensorFlow", "Computer Vision", "NLP"],
        project: "AI-Powered Application",
      },
      {
        week: 4,
        title: "Data Engineering & Deployment",
        topics: ["Big Data", "Cloud ML", "Model Deployment", "MLOps"],
        project: "End-to-End ML Pipeline",
      },
    ],
    outcomes: [
      "Analyze complex datasets",
      "Build machine learning models",
      "Create data visualizations",
      "Deploy AI solutions",
      "Make data-driven decisions",
      "Implement ethical AI practices",
    ],
    requirements: [
      "Basic programming knowledge",
      "Understanding of mathematics and statistics",
      "Analytical mindset",
      "Curiosity about data and patterns",
    ],
    schedule: {
      format: "Online with Lab Access",
      duration: "14 weeks",
      commitment: "18-22 hours/week",
      startDate: "Monthly",
    },
    pricing: {
      original: 3299,
      current: 2199,
      installments: true,
    },
    certification: {
      type: "Professional Certificate",
      accredited: true,
      industry: ["Google Cloud ML", "AWS ML", "Microsoft AI"],
    },
    jobOutcomes: {
      averageSalary: "$90,000 - $130,000",
      placementRate: "93%",
      topCompanies: ["Amazon", "Tesla", "Uber", "Airbnb"],
    },
  },
  dataanalysis: {
    id: "dataanalysis",
    title: "Data Analysis & Business Intelligence",
    description: "Transform raw data into actionable business insights",
    longDescription:
      "Learn to analyze data and create compelling visualizations that drive business decisions. Master SQL, Excel, Power BI, and statistical methods for business intelligence and data-driven decision making.",
    icon: Database,
    duration: "10 weeks",
    students: "180+",
    level: "Beginner",
    skills: [
      "SQL",
      "Excel/Power BI",
      "Statistical Methods",
      "Business Intelligence",
      "Data Visualization",
      "Reporting",
    ],
    color: "from-purple-500 to-pink-500",
    instructor: {
      name: "Michael Thompson",
      title: "Business Intelligence Manager",
      experience: "9+ years",
      rating: 4.7,
      students: 600,
      image: "/placeholder.svg?height=100&width=100",
      bio: "Business intelligence expert with experience across multiple industries. Specializes in turning complex data into actionable insights that drive business growth and strategic decision-making.",
    },
    curriculum: [
      {
        week: 1,
        title: "Data Analysis Fundamentals",
        topics: ["Excel Advanced", "Statistical Concepts", "Data Cleaning", "Data Types"],
        project: "Business Report Dashboard",
      },
      {
        week: 2,
        title: "SQL & Database Management",
        topics: ["SQL Queries", "Database Design", "Data Warehousing", "ETL Processes"],
        project: "Database Analysis Project",
      },
      {
        week: 3,
        title: "Business Intelligence Tools",
        topics: ["Power BI", "Tableau", "Data Visualization", "Dashboard Design"],
        project: "Interactive BI Dashboard",
      },
      {
        week: 4,
        title: "Advanced Analytics",
        topics: ["Predictive Analytics", "KPI Development", "Reporting", "Business Strategy"],
        project: "Business Intelligence Strategy",
      },
    ],
    outcomes: [
      "Analyze business data effectively",
      "Create compelling visualizations",
      "Build interactive dashboards",
      "Generate actionable insights",
      "Present findings to stakeholders",
      "Drive data-driven decisions",
    ],
    requirements: [
      "Basic computer skills",
      "Interest in data and analytics",
      "Business acumen helpful but not required",
      "Attention to detail",
    ],
    schedule: {
      format: "Online with Weekly Workshops",
      duration: "10 weeks",
      commitment: "12-15 hours/week",
      startDate: "Weekly",
    },
    pricing: {
      original: 2499,
      current: 1699,
      installments: true,
    },
    certification: {
      type: "Professional Certificate",
      accredited: true,
      industry: ["Microsoft Power BI", "Tableau", "Google Analytics"],
    },
    jobOutcomes: {
      averageSalary: "$65,000 - $95,000",
      placementRate: "97%",
      topCompanies: ["Deloitte", "McKinsey", "Accenture", "PwC"],
    },
  },
}

interface CourseModalProps {
  courseId: string
  isVisible: boolean
  onClose: () => void
}

export default function CourseModalNew({ courseId, isVisible, onClose }: CourseModalProps) {
  const course = courseData[courseId]

  if (!course || !isVisible) return null

  const Icon = course.icon
  const discountPercentage = Math.round(
    ((course.pricing.original - course.pricing.current) / course.pricing.original) * 100,
  )

  console.log(`CourseModalNew: Rendering for courseId: ${courseId}`)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
        style={{ animation: "fadeIn 300ms ease-out" }}
      />

      {/* Modal Content */}
      <div
        className="relative bg-background border border-border rounded-2xl shadow-2xl max-w-7xl max-h-[95vh] overflow-y-auto mx-4 w-full"
        style={{ animation: "slideIn 300ms ease-out" }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-muted/80 backdrop-blur-sm p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>

        <div className="p-6">
          {/* Header */}
          <div className="space-y-6 pb-8 border-b">
            <div className="flex items-start justify-between pr-12">
              <div className="flex items-center gap-6">
                <div className={`p-4 rounded-2xl bg-gradient-to-r ${course.color} text-white shadow-lg`}>
                  <Icon className="h-10 w-10" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-space-grotesk font-bold mb-3">{course.title}</h2>
                  <p className="text-lg leading-relaxed max-w-2xl text-muted-foreground">{course.longDescription}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {course.level}
                </Badge>
                <Badge variant="outline" className="text-sm px-3 py-1">
                  {course.students} enrolled
                </Badge>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-semibold">{course.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Students</p>
                  <p className="font-semibold">{course.students}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <Award className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Certificate</p>
                  <p className="font-semibold">Included</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Job Placement</p>
                  <p className="font-semibold">{course.jobOutcomes.placementRate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <DollarSign className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Salary</p>
                  <p className="font-semibold text-xs">{course.jobOutcomes.averageSalary}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-10 py-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Instructor Section */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold">Meet Your Instructor</h3>
                <div className="flex items-start gap-6 p-6 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl">
                  <div className="w-20 h-20 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xl">
                      {course.instructor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-xl mb-1">{course.instructor.name}</h4>
                    <p className="text-muted-foreground text-lg mb-3">{course.instructor.title}</p>
                    <p className="text-sm leading-relaxed mb-4">{course.instructor.bio}</p>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{course.instructor.rating}</span>
                      </div>
                      <span className="text-muted-foreground">{course.instructor.experience} experience</span>
                      <span className="text-muted-foreground">{course.instructor.students}+ students taught</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Curriculum */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold">Curriculum Overview</h3>
                <div className="space-y-6">
                  {course.curriculum.map((week, index) => (
                    <div key={index} className="border rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-lg">
                          Week {week.week}: {week.title}
                        </h4>
                        <Badge variant="outline">{week.topics.length} topics</Badge>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        {week.topics.map((topic, topicIndex) => (
                          <div key={topicIndex} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span>{topic}</span>
                          </div>
                        ))}
                      </div>
                      {week.project && (
                        <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
                          <Target className="h-5 w-5 text-primary" />
                          <span className="font-medium">Capstone Project: {week.project}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning Outcomes */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold">What You'll Achieve</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {course.outcomes.map((outcome, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-muted/20 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Pricing Card */}
              <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-2xl p-8 space-y-6 border">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <span className="text-4xl font-bold">${course.pricing.current}</span>
                    <span className="text-xl text-muted-foreground line-through">${course.pricing.original}</span>
                  </div>
                  <Badge variant="destructive" className="mb-4 text-sm px-3 py-1">
                    Save {discountPercentage}% - Limited Time!
                  </Badge>
                  {course.pricing.installments && (
                    <p className="text-sm text-muted-foreground">
                      Or ${Math.round(course.pricing.current / 6)}/month for 6 months
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Button className="w-full" size="lg" asChild>
                    <Link href={`/programs/${course.id}/enroll`}>
                      Enroll Now - Start Learning
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/contact">Get Free Consultation</Link>
                  </Button>
                </div>

                <div className="text-center text-xs text-muted-foreground">
                  <p>✓ 30-day money-back guarantee</p>
                  <p>✓ Lifetime access to course materials</p>
                  <p>✓ Job placement assistance included</p>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Skills You'll Master</h4>
                <div className="flex flex-wrap gap-2">
                  {course.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
