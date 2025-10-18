import { HiClock, HiCodeBracket, HiCalendarDays, HiUsers } from "react-icons/hi2";
import {
    HiVideoCamera,
    HiCode,
    HiClock as HiClockOld,
    HiUsers as HiUsersOld,
    HiChartBar,
    HiLightningBolt
} from 'react-icons/hi';

// =============================================================================
// DASHBOARD & INTERVIEW MANAGEMENT
// =============================================================================

export const INTERVIEW_CATEGORY = [
    { id: "scheduled", title: "Scheduled Interviews", variant: "outline" },
    { id: "ongoing", title: "Ongoing", variant: "default" },
    { id: "pending_review", title: "Pending Review", variant: "destructive" },
    { id: "reviewed", title: "Reviewed", variant: "default" },
] as const;

export const TIME_SLOTS = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
];

export const QUICK_ACTIONS = [
    {
        icon: HiCodeBracket,
        title: "New Call",
        description: "Start an instant call",
        iconBg: "bg-primary/10",
        iconColor: "text-primary",
        gradient: "from-primary/10 via-primary/5 to-transparent",
    },
    {
        icon: HiUsers,
        title: "Join Interview",
        description: "Enter via invitation link",
        iconBg: "bg-purple-500/10",
        iconColor: "text-purple-500",
        gradient: "from-purple-500/10 via-purple-500/5 to-transparent",
    },
    {
        icon: HiCalendarDays,
        title: "Schedule",
        description: "Plan upcoming interviews",
        iconBg: "bg-blue-500/10",
        iconColor: "text-blue-500",
        gradient: "from-blue-500/10 via-blue-500/5 to-transparent",
    },
    {
        icon: HiClock,
        title: "Recordings",
        description: "Access past interviews",
        iconBg: "bg-orange-500/10",
        iconColor: "text-orange-500",
        gradient: "from-orange-500/10 via-orange-500/5 to-transparent",
    },
];

export const CODING_QUESTIONS: CodeQuestion[] = [
    {
        id: "two-sum",
        title: "Two Sum",
        description:
            "Given an array of integers `nums` and an integer `target`, return indices of the two numbers in the array such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
        examples: [
            {
                input: "nums = [2,7,11,15], target = 9",
                output: "[0,1]",
                explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]",
            },
            {
                input: "nums = [3,2,4], target = 6",
                output: "[1,2]",
            },
        ],
        starterCode: {
            javascript: `function twoSum(nums, target) {
  // Write your solution here
  
}`,
            python: `def two_sum(nums, target):
    # Write your solution here
    pass`,
            java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        
    }
}`,
            go: `func twoSum(nums []int, target int) []int {
    // Write your solution here
    
}`,
            cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        
    }
};`,
            csharp: `public class Solution {
    public int[] TwoSum(int[] nums, int target) {
        // Write your solution here
        
    }
}`,
        },
        constraints: [
            "2 ≤ nums.length ≤ 104",
            "-109 ≤ nums[i] ≤ 109",
            "-109 ≤ target ≤ 109",
            "Only one valid answer exists.",
        ],
    },
    {
        id: "reverse-string",
        title: "Reverse String",
        description:
            "Write a function that reverses a string. The input string is given as an array of characters `s`.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.",
        examples: [
            {
                input: 's = ["h","e","l","l","o"]',
                output: '["o","l","l","e","h"]',
            },
            {
                input: 's = ["H","a","n","n","a","h"]',
                output: '["h","a","n","n","a","H"]',
            },
        ],
        starterCode: {
            javascript: `function reverseString(s) {
  // Write your solution here
  
}`,
            python: `def reverse_string(s):
    # Write your solution here
    pass`,
            java: `class Solution {
    public void reverseString(char[] s) {
        // Write your solution here
        
    }
}`,
            go: `func reverseString(s []byte) {
    // Write your solution here
    
}`,
            cpp: `class Solution {
public:
    void reverseString(vector<char>& s) {
        // Write your solution here
        
    }
};`,
            csharp: `public class Solution {
    public void ReverseString(char[] s) {
        // Write your solution here
        
    }
}`,
        },
    },
    {
        id: "palindrome-number",
        title: "Palindrome Number",
        description:
            "Given an integer `x`, return `true` if `x` is a palindrome, and `false` otherwise.\n\nAn integer is a palindrome when it reads the same forward and backward.",
        examples: [
            {
                input: "x = 121",
                output: "true",
                explanation: "121 reads as 121 from left to right and from right to left.",
            },
            {
                input: "x = -121",
                output: "false",
                explanation:
                    "From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.",
            },
        ],
        starterCode: {
            javascript: `function isPalindrome(x) {
  // Write your solution here
  
}`,
            python: `def is_palindrome(x):
    # Write your solution here
    pass`,
            java: `class Solution {
    public boolean isPalindrome(int x) {
        // Write your solution here
        
    }
}`,
            go: `func isPalindrome(x int) bool {
    // Write your solution here
    
}`,
            cpp: `class Solution {
public:
    bool isPalindrome(int x) {
        // Write your solution here
        
    }
};`,
            csharp: `public class Solution {
    public bool IsPalindrome(int x) {
        // Write your solution here
        
    }
}`,
        },
    },
];

export const LANGUAGES = [
    { id: "javascript", name: "JavaScript", icon: "/javascript.png" },
    { id: "python", name: "Python", icon: "/python.png" },
    { id: "java", name: "Java", icon: "/java.png" },
    { id: "go", name: "Go", icon: "/go.png" },
    { id: "cpp", name: "C++", icon: "/cpp.png" },
    { id: "csharp", name: "C#", icon: "/csharp.png" },
] as const;

export interface CodeQuestion {
    id: string;
    title: string;
    description: string;
    examples: Array<{
        input: string;
        output: string;
        explanation?: string;
    }>;
    starterCode: {
        javascript: string;
        python: string;
        java: string;
        go: string;
        cpp: string;
        csharp: string;
    };
    constraints?: string[];
}

export type QuickActionType = (typeof QUICK_ACTIONS)[number];

export const LOADING_MESSAGES = {
    // Meeting/Interview related contexts
    meeting: [
        "Setting up your interview environment...",
        "Connecting to the meeting room...",
        "Preparing your workspace...",
        "Almost ready to start...",
        "Loading your interview tools...",
        "Preparing the coding environment...",
    ],

    // User and Authentication contexts
    user: [
        "Loading your profile...",
        "Authenticating your session...",
        "Fetching user data...",
        "Setting up your account...",
    ],
    auth: [
        "Verifying your identity...",
        "Signing you in...",
        "Setting up your session...",
        "Almost ready...",
    ],

    // Data fetching contexts
    interviews: [
        "Loading your interviews...",
        "Fetching interview history...",
        "Preparing your schedule...",
        "Getting interview data...",
    ],
    recordings: [
        "Loading your recordings...",
        "Fetching past sessions...",
        "Preparing video archives...",
        "Getting recording data...",
    ],
    schedule: [
        "Loading your schedule...",
        "Fetching upcoming interviews...",
        "Preparing calendar data...",
        "Getting schedule information...",
    ],
    dashboard: [
        "Loading your dashboard...",
        "Fetching analytics data...",
        "Preparing insights...",
        "Getting dashboard information...",
    ],

    // Comments and feedback contexts
    comments: [
        "Loading feedback...",
        "Fetching comments...",
        "Preparing evaluation data...",
        "Getting review information...",
    ],

    // Meeting actions contexts
    create: [
        "Creating your meeting...",
        "Setting up the call...",
        "Preparing meeting room...",
        "Almost ready to start...",
    ],
    join: [
        "Joining the meeting...",
        "Connecting to participants...",
        "Setting up your connection...",
        "Almost connected...",
    ],

    // General fallback
    general: [
        "Getting everything ready...",
        "Almost there...",
    ]
} as const;

export type LoadingContext = keyof typeof LOADING_MESSAGES;

// =============================================================================
// LANDING PAGE
// =============================================================================

// Navigation
// -----------------------------------------------------------------------------
export const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#product', label: 'Product' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#faq', label: 'FAQ' },
];


// Features
// -----------------------------------------------------------------------------
export const features = [
    {
        icon: HiVideoCamera,
        title: 'HD Video Interviews',
        description: 'Crystal-clear video quality powered by Stream.io for seamless remote interviews.'
    },
    {
        icon: HiCode,
        title: 'Live Code Editor',
        description: 'Built-in Monaco editor for real-time collaborative coding sessions during technical interviews.'
    },
    {
        icon: HiClockOld,
        title: 'Smart Scheduling',
        description: 'Effortlessly schedule and manage interviews with automated reminders and calendar integrations.'
    },
    {
        icon: HiUsersOld,
        title: 'Multi-Role Support',
        description: 'Separate experiences for candidates and interviewers with role-based permissions.'
    },
    {
        icon: HiChartBar,
        title: 'Real-time Analytics',
        description: 'Track interview performance, candidate progress, and team metrics in real-time.'
    },
    {
        icon: HiLightningBolt,
        title: 'Instant Notifications',
        description: 'Stay updated with real-time notifications for interview invites, updates, and feedback.'
    },
];

// Product Tabs
// -----------------------------------------------------------------------------
export const productTabs = [
    {
        title: 'Seamless Video Conferencing',
        description: 'Experience high-quality video interviews with built-in screen sharing, recording capabilities, and robust connection handling. Our Stream.io integration ensures crystal-clear communication every time.',
        tags: ['HD Video', 'Screen Share', 'Recording'],
    },
    {
        title: 'Interactive Code Collaboration',
        description: 'Evaluate technical skills in real-time with our integrated Monaco code editor. Support for multiple programming languages, syntax highlighting, and live collaboration makes technical assessments seamless.',
        tags: ['Live Coding', 'Multi-Language', 'Syntax Highlighting'],
    },
    {
        title: 'Comprehensive Dashboard',
        description: 'Monitor all your interviews from a single dashboard. Track scheduled, ongoing, and completed interviews with detailed analytics and performance metrics at your fingertips.',
        tags: ['Analytics', 'Scheduling', 'Reporting'],
    },
    {
        title: 'Secure & Scalable',
        description: 'Built with enterprise-grade security using Clerk authentication and Convex backend. Scale effortlessly from startup to enterprise with our robust infrastructure.',
        tags: ['Clerk Auth', 'Convex DB', 'Enterprise Ready'],
    }
];

// Testimonials
// -----------------------------------------------------------------------------
export const testimonials = [
    {
        quote: "HeyU transformed our hiring process. The integrated code editor and video quality are outstanding. We've reduced our time-to-hire by 40% while improving candidate experience.",
        name: 'Sarah Chen',
        title: 'Head of Engineering',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
    },
    {
        quote: "As a remote-first company, HeyU has been game-changing. The platform is intuitive, reliable, and has everything we need for technical interviews in one place.",
        name: 'Michael Rodriguez',
        title: 'CTO',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
    },
    {
        quote: "The candidate experience is fantastic. Everyone comments on how professional and smooth the interview process feels. HeyU gives us a competitive edge in attracting top talent.",
        name: 'Emily Thompson',
        title: 'Talent Acquisition Lead',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'
    }
];

// FAQ
// -----------------------------------------------------------------------------
export const faqData = [
    {
        q: 'How does HeyU handle video quality and reliability?',
        a: 'HeyU uses Stream.io, an enterprise-grade video infrastructure that ensures HD quality, adaptive bitrate, and automatic fallback mechanisms. Your interviews stay smooth even with varying network conditions.'
    },
    {
        q: 'Can I customize the interview workflow?',
        a: 'Yes! HeyU offers flexible interview configurations including custom durations, recording preferences, and role-specific settings. You can tailor the platform to match your hiring process.'
    },
    {
        q: 'What programming languages are supported in the code editor?',
        a: 'Our Monaco-powered code editor supports 50+ programming languages including JavaScript, TypeScript, Python, Java, C++, Go, and more with full syntax highlighting and IntelliSense.'
    },
    {
        q: 'Is my interview data secure?',
        a: 'Absolutely. We use Clerk for authentication with industry-standard encryption, and Convex for secure data storage. All video streams are encrypted end-to-end, and we\'re fully GDPR and SOC 2 compliant.'
    },
];

// Company & Stats
// -----------------------------------------------------------------------------

export const stats = [
    {
        value: "10,000+",
        description: "Successful interviews conducted across companies worldwide.",
    },
    {
        value: "99.9%",
        description: "Uptime guarantee with enterprise-grade infrastructure and monitoring.",
    },
    {
        value: "50+",
        description: "Programming languages supported in our interactive code editor.",
    },
];