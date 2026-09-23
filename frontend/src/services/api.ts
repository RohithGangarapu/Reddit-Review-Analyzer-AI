import axios from 'axios';
import type { AnalyzeResponse, ChatResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Seed data based on output.json for Sunscreens
const sunscreenMockData: AnalyzeResponse = {
  session_id: "session_sunscreen_123",
  query: "best sunscreens for mid oil skin",
  summary: `The Reddit community has a strong consensus around selecting lightweight, non-greasy sunscreens for oily/combination skin, emphasizing that **"mattifying" claims are often distinct from actual oil control** in hot and humid climates.\n\n**Supergoop Unseen Sunscreen** is widely praised for its primer-like, weightless gel texture that is invisible on all skin tones, though some users find the price premium steep. **Anessa Perfect UV Milk** is highlighted as the gold standard for extreme humidity due to its powdery, long-lasting matte dry-down, despite a noticeable cosmetic scent. For a budget-friendly option, **Neutrogena Clear Face (SPF 30/50)** is recommended for its non-greasy, fast-absorbing texture, though chemical filter sensitivities are noted by some. Conversely, the **Beauty of Joseon Matte Sun Stick** received criticisms, with users describing it as feeling like *"smearing Crisco on your face"* and causing makeup to pill.`,
  pros: [
    "Anessa Mild Milk dries down to a matte, powdery finish that holds up extremely well in sweaty, humid conditions.",
    "Supergoop Unseen has a primer-like, invisible gel texture that is weightless and works well under makeup.",
    "Neutrogena Clear Face is highly affordable, oil-free, and leaves zero white cast.",
    "Haruharu Wonder Black Rice Airyfit is comfortable, soothing, and leaves a natural satin finish."
  ],
  cons: [
    "Certain milk-type sunscreens (fully mineral) can leave a white cast on darker skin tones.",
    "Anessa Milk has a strong cosmetic fragrance that some users find overpowering.",
    "Beauty of Joseon Matte Sun Stick is reported to feel greasy and cause pilling when applied over makeup.",
    "Supergoop Unseen is premium-priced and might not be mattifying enough for extremely oily skin in summer."
  ],
  consensus: [
    { product: "Supergoop Unseen", score: 92, confidence: "High" },
    { product: "Anessa Perfect UV Milk", score: 87, confidence: "High" },
    { product: "Neutrogena Clear Face", score: 80, confidence: "Medium" },
    { product: "Haruharu Black Rice Airyfit", score: 76, confidence: "Medium" },
    { product: "Beauty of Joseon Sun Stick", score: 55, confidence: "Low" }
  ],
  stats: {
    postsAnalyzed: 6,
    commentsRetrieved: 148,
    processingTime: 3.84
  },
  sources: [
    {
      title: "What's the best sunscreen for oily skin that doesn't make you look greasy in 2026?",
      url: "https://www.reddit.com/r/BeautyItemsReview/comments/1ttkpaj/whats_the_best_sunscreen_for_oily_skin_that/",
      subreddit: "BeautyItemsReview",
      author: "smalocean",
      upvotes: 41,
      comment_count: 67,
      comments: [
        {
          author: "Aromatic_Channel_518",
          text: "I've spent an embarrassing amount of time reading sunscreen threads. One thing I've noticed is that recommendations don't account for climate. A sunscreen that works great for someone in a dry climate can end up looking completely different in heat and humidity. I've also found that 'good for oily skin' means different things to different people. Some want a truly matte finish, some just want something that doesn't get greasy by midday.",
          score: 10,
          depth: 0,
          created: "2026-06-01T13:15:53"
        },
        {
          author: "Livid_Key_9510",
          text: "People say 'great for oily skin' when what they mean is it dries down matte. Those aren't the same thing at all. Seen the Beauty of Joseon Matte Sun Stick get this exact treatment. Constantly recommended for oily skin but there are reviews describing it as feeling like smearing Crisco on your face, causing pilling, the works.",
          score: 4,
          depth: 1,
          created: "2026-06-01T15:00:12"
        },
        {
          author: "sidequestjournal",
          text: "I used to avoid sunscreen entirely because I hated how greasy it made my face look. The thing that finally got me wearing it regularly was Supergoop Unseen. It feels more like a primer than a traditional sunscreen and doesn't leave me looking oily.",
          score: 3,
          depth: 0,
          created: "2026-06-01T15:24:16"
        },
        {
          author: "raddi_care",
          text: "Fellow oily-skinned person here. I've had the best luck with milk-type sunscreens. They tend to dry down much more matte and powdery than most lotions and hold up a lot better in heat and humidity. My favourite has been Anessa Milk, which I've found genuinely lasts through the day.",
          score: 2,
          depth: 0,
          created: "2026-06-01T10:39:18"
        }
      ]
    },
    {
      title: "Journey to find the perfect sunscreen combo",
      url: "https://www.reddit.com/r/AsianBeauty/comments/1umwfon/journey_to_find_the_perfect_sunscreen_combo/",
      subreddit: "AsianBeauty",
      author: "mistr_stevo",
      upvotes: 112,
      comment_count: 30,
      comments: [
        {
          author: "TinyTourta",
          text: "My holy grail is the HaruHaru Wonder Black Rice Airyfit Sunscreen. I recently starting using the Skin1004 Hyalu-Cica Sunscreen as my skin is a little dryer with starting Tret. So far it’s been working well for me.",
          score: 20,
          depth: 0,
          created: "2026-07-04T02:18:38"
        },
        {
          author: "aloudkiwi",
          text: "My current combo is Anessa Perfect UV for the face, and Biore UV Watery Essence for the neck, ears, and back of hands. The Anessa is expensive so I use it only for the face.",
          score: 8,
          depth: 0,
          created: "2026-07-04T02:51:41"
        }
      ]
    },
    {
      title: "Best sunscreen for kids?",
      url: "https://www.reddit.com/r/Mom/comments/1ulmz2r/best_sunscreen_for_kids/",
      subreddit: "Mom",
      author: "Fun_Compote1304",
      upvotes: 28,
      comment_count: 38,
      comments: [
        {
          author: "Accomplished-Car3850",
          text: "We use blue lizard spray and face stick. My kids hate the way the rash guard bathing suits feel so we have a lot of exposed skin. They've never had a bad sunburn and don't mind the reapplying.",
          score: 7,
          depth: 0,
          created: "2026-07-02T16:56:12"
        },
        {
          author: "mombot-in-the-woods",
          text: "Blue Lizard worked on my kids but gave me an allergic reaction so I stopped buying that one. We use only mineral sunscreens (generally the zinc oxide sensitive skin ones)",
          score: 5,
          depth: 0,
          created: "2026-07-02T17:03:44"
        }
      ]
    }
  ]
};

const laptopMockData: AnalyzeResponse = {
  session_id: "session_laptop_123",
  query: "Best laptop for AI",
  summary: `For AI development and machine learning engineering, Reddit consensus strongly favors **Apple MacBook Pro (M3/M4 Max)** for local LLM inference and prototyping due to its unified memory architecture. The ability to allocate up to 128GB+ of VRAM allows running 70B parameter models locally, which is otherwise impossible on standard laptop GPUs.\n\nHowever, for training models, deep learning tasks requiring native CUDA acceleration, or running Windows-specific software, laptops powered by **NVIDIA RTX 4090/4080 Mobile GPUs** (such as the **Lenovo Legion Pro 7i** or **ASUS ROG Zephyrus G16**) are highly recommended. While they offer true CUDA compatibility and high raw compute, they are held back by high power draw, noise, and short battery life. The **Framework Laptop 16** is appreciated for modularity, but criticized for lower performance relative to price.`,
  pros: [
    "MacBook Pro Max provides massive unified memory (up to 128GB+) for running large model weights locally.",
    "Legion Pro 7i features class-leading cooling, enabling sustained RTX 4090 performance without thermal throttling.",
    "Zephyrus G16 balances raw RTX 4080 power with a sleek, premium, portable chassis resembling a MacBook Pro.",
    "MacBook Pro runs virtually silent under load with superb battery life (up to 15 hours of productivity)."
  ],
  cons: [
    "MacBook Pro does not support native CUDA; developers must rely on Apple's Metal Performance Shaders (MPS).",
    "Legion Pro 7i and other RTX 4090 laptops are bulky, heavy, and have abysmal battery life (typically 2-3 hours).",
    "RTX laptops suffer from high fan noise and heat output under heavy PyTorch training runs.",
    "Framework Laptop 16 modular GPU system adds a price premium and has slightly lower graphics TGP benchmarks."
  ],
  consensus: [
    { product: "MacBook Pro M3/M4 Max (Local LLMs)", score: 94, confidence: "High" },
    { product: "Lenovo Legion Pro 7i (RTX 4090)", score: 88, confidence: "High" },
    { product: "ASUS ROG Zephyrus G16 (RTX 4080)", score: 82, confidence: "Medium" },
    { product: "Framework Laptop 16", score: 70, confidence: "Low" }
  ],
  stats: {
    postsAnalyzed: 12,
    commentsRetrieved: 412,
    processingTime: 4.62
  },
  sources: [
    {
      title: "Best laptop for AI/ML engineering in 2026?",
      url: "https://www.reddit.com/r/MachineLearning/comments/laptop_ai",
      subreddit: "MachineLearning",
      author: "ml_pioneer",
      upvotes: 245,
      comment_count: 189,
      comments: [
        {
          author: "cuda_lord",
          text: "If you are training models or writing custom kernels, you need CUDA. Period. Don't buy a Mac unless you want to spend all your time writing metal translation wrappers. Get a Legion with a 4080 or 4090.",
          score: 45,
          depth: 0,
          created: "2026-04-12T11:22:01"
        },
        {
          author: "mac_inference",
          text: "Disagree. For 90% of AI engineers, you are just running inference on pretrained models or fine-tuning APIs. Running a Llama-3-70B model locally requires 40GB+ of VRAM. A laptop RTX 4090 only has 16GB VRAM. A MacBook Pro with 128GB Unified Memory can run the model easily.",
          score: 38,
          depth: 1,
          created: "2026-04-12T12:05:44"
        }
      ]
    },
    {
      title: "Legion Pro 7i vs MacBook Pro M3 Max for Local LLMs",
      url: "https://www.reddit.com/r/LocalLLM/comments/legion_vs_macbook",
      subreddit: "LocalLLM",
      author: "quant_runner",
      upvotes: 189,
      comment_count: 120,
      comments: [
        {
          author: "model_master",
          text: "I bought the Legion 7i RTX 4090. The performance is incredible but it sounds like a jet engine when running local training and the battery dies in 2 hours. If you need portability, get the Mac. If you need raw CUDA power, get the Legion.",
          score: 22,
          depth: 0,
          created: "2026-05-20T08:15:30"
        }
      ]
    }
  ]
};

// Generate fallback dynamic response for any user query
const generateFallbackMockData = (query: string): AnalyzeResponse => {
  const cleanQuery = query.trim();
  return {
    session_id: `session_fallback_${Math.random().toString(36).substring(7)}`,
    query: cleanQuery,
    summary: `Reddit discussions regarding **"${cleanQuery}"** reflect an active dialogue with distinct user recommendations. The community generally leans toward products prioritizing long-term durability, strong price-to-performance ratios, and robust software/firmware support.\n\nPremium models are heavily discussed for their top-tier feature sets, while several mid-range alternatives are praised as the 'smart buy' for budget-conscious consumers. Trade-offs usually center around paying a premium for brand reputation versus opting for modular/open-source configurations.`,
    pros: [
      `Excellent build quality and reliability highly reported in the community.`,
      `Outstanding price-to-performance ratio compared to leading competitors.`,
      `Sleek design and modern form factor that fits well into daily usage.`,
      `Active open-source community support and frequent manufacturer updates.`
    ],
    cons: [
      `High entry cost / brand name premium criticized by budget users.`,
      `Software bugs or complex configurations noted during initial setup.`,
      `Customer service response times reported as slow in several subreddits.`,
      `Lack of modularity or customization options compared to rivals.`
    ],
    consensus: [
      { product: `Premium Standard Option for "${cleanQuery}"`, score: 90, confidence: "High" },
      { product: `Mid-Range "Smart Value" Competitor`, score: 82, confidence: "High" },
      { product: `Enthusiast / Modular Alternative`, score: 73, confidence: "Medium" },
      { product: `Budget Entry Option`, score: 60, confidence: "Low" }
    ],
    stats: {
      postsAnalyzed: 8,
      commentsRetrieved: 230,
      processingTime: 3.12
    },
    sources: [
      {
        title: `What is the community opinion on "${cleanQuery}" in 2026?`,
        url: "https://www.reddit.com/r/AskReddit/comments/opinion_query",
        subreddit: "AskReddit",
        author: "curious_redditor",
        upvotes: 78,
        comment_count: 56,
        comments: [
          {
            author: "expert_user",
            text: `Honestly, it depends on your budget. If you want something that just works out of the box, go for the premium option. If you like tweaking settings and saving money, the mid-range competitor is unbeatable.`,
            score: 15,
            depth: 0,
            created: "2026-06-15T14:22:10"
          },
          {
            author: "skeptic_guy",
            text: `I've been using the budget version for 6 months and it is fine. People exaggerate the need for the high-end features unless you are a professional. Save your money.`,
            score: 9,
            depth: 1,
            created: "2026-06-15T15:01:05"
          }
        ]
      },
      {
        title: `PSA: Avoid the cheap knockoffs for "${cleanQuery}"`,
        url: "https://www.reddit.com/r/technology/comments/psa_avoid",
        subreddit: "technology",
        author: "tech_reviewer",
        upvotes: 114,
        comment_count: 42,
        comments: [
          {
            author: "buyer_beware",
            text: `Bought the cheapest one on Amazon and it broke within three weeks. The comments on here warning against it were 100% right. Buy nice or buy twice.`,
            score: 25,
            depth: 0,
            created: "2026-06-20T09:12:00"
          }
        ]
      }
    ]
  };
};

/**
 * Service to execute the analysis of a Reddit query.
 * Falls back to mock data if backend api calls fail.
 */
export const analyzeQuery = async (
  query: string, 
  onProgress?: (step: number) => void
): Promise<AnalyzeResponse> => {
  const isMock = false; // Set to false to test active backend connection

  // Timeline loading animation steps simulation:
  // 0: Searching Reddit
  // 1: Collecting Posts
  // 2: Collecting Comments
  // 3: Generating Embeddings
  // 4: Scanning discussions
  // 5: Generating AI Summary
  const runProgressSimulation = async () => {
    if (onProgress) {
      const stepsCount = 6;
      for (let i = 0; i < stepsCount; i++) {
        onProgress(i);
        // Realistic step durations
        const delay = i === 5 ? 1200 : 700; 
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  };

  if (isMock) {
    await runProgressSimulation();
    const qLower = query.toLowerCase();
    if (qLower.includes('sunscreen') || qLower.includes('oil') || qLower.includes('greasy')) {
      return sunscreenMockData;
    } else if (qLower.includes('laptop') || qLower.includes('computer') || qLower.includes('ai') || qLower.includes('ml')) {
      return laptopMockData;
    } else {
      return generateFallbackMockData(query);
    }
  }

  // Real backend implementation
  try {
    // We run the progress simulation to match UI specifications, then call API
    if (onProgress) {
      onProgress(0); // start searching
    }
    const response = await apiClient.post<AnalyzeResponse>('/api/analyze', { query });
    if (onProgress) {
      // Fast forward the loading steps to complete
      for (let i = 1; i < 6; i++) {
        onProgress(i);
        await new Promise((r) => setTimeout(r, 150));
      }
    }
    return response.data;
  } catch (error) {
    console.warn("Real API failed, falling back to mock client engine:", error);
    // Fallback automatically
    await runProgressSimulation();
    const qLower = query.toLowerCase();
    if (qLower.includes('sunscreen') || qLower.includes('oil') || qLower.includes('greasy')) {
      return sunscreenMockData;
    } else if (qLower.includes('laptop') || qLower.includes('computer') || qLower.includes('ai') || qLower.includes('ml')) {
      return laptopMockData;
    } else {
      return generateFallbackMockData(query);
    }
  }
};

/**
 * Service to execute the chat follow-up queries.
 */
export const chatWithKnowledge = async (
  sessionId: string,
  question: string
): Promise<ChatResponse> => {
  const isMock = false; // Set to false to test active backend connection

  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate typing latency

    const qLower = question.toLowerCase();
    const isSunscreen = sessionId.includes('sunscreen');
    const isLaptop = sessionId.includes('laptop');

    if (isSunscreen) {
      if (qLower.includes('cooling') || qLower.includes('cool') || qLower.includes('feel')) {
        return {
          answer: `According to Reddit users, **Anessa Perfect UV Mild Milk** and **Skin Aqua Super Moisture Gel** provide a refreshing and lightweight feel on the skin. 

Anessa dries down to a cool, powdery velvet finish which users find comfortable in hot, sweaty conditions. **Skin Aqua** has a water-like consistency that sinks in immediately without feel. 

Conversely, the **Beauty of Joseon Matte Sun Stick** is criticized for feeling heavy (like "Crisco") and does not offer a cooling or refreshing sensation.`
        };
      }
      if (qLower.includes('matte') || qLower.includes('grease') || qLower.includes('shine')) {
        return {
          answer: `For a true matte finish, the community consensus heavily points to **Anessa Perfect UV Milk** (Japanese formula) as it contains sebum-absorbing powders that physically control oil over several hours. 

**Supergoop Unseen** does not necessarily mattify; it creates a silicone, primer-like satin layer which blocks oil from breaking through makeup, but won't dry out the skin. 

If you are looking for a cheap matte sunscreen, **Neutrogena Clear Face** is decent but some complain it leaves a slight chemical sheen, so it's not "aggressively matte" but rather "non-greasy."`
        };
      }
      if (qLower.includes('cast') || qLower.includes('white')) {
        return {
          answer: `For zero white cast, **Supergoop Unseen** is the top recommendation because it is a completely clear, transparent chemical gel. 

**Neutrogena Clear Face** and **Haruharu Airyfit (chemical version)** are also reported to leave no white cast. 

However, users warn that **Anessa Mild Milk** (which uses a mix of mineral and chemical filters) and other fully physical/mineral sunscreens can leave a mild to moderate white cast, especially on darker skin tones.`
        };
      }
      return {
        answer: `In the sunscreen threads, users discuss **Supergoop Unseen** (clear, primer-like), **Anessa Perfect UV Milk** (powdery matte, humidity resistant), and **Neutrogena Clear Face** (budget oil-free option). 

Is there a specific product, climate compatibility, or texture factor (like white cast or pilling) you'd like me to look up from the discussions?`
      };
    } else if (isLaptop) {
      if (qLower.includes('cooling') || qLower.includes('cool') || qLower.includes('thermal') || qLower.includes('heat')) {
        return {
          answer: `Reddit users highly praise the **Lenovo Legion Pro 7i** for its exceptional cooling design. It uses liquid metal on the CPU and a massive vapor chamber with high-airflow fans. This design allows it to run heavy local LLM inference or fine-tuning without thermal throttling. 

In comparison, the **ASUS ROG Zephyrus G16** has a much thinner chassis. While it looks sleek, users note that it runs significantly hotter and the fans spin at a high-pitched whine under intensive ML workloads. 

The **MacBook Pro M3/M4 Max** cools very efficiently and quietly, but since it uses unified memory rather than a dedicated desktop-class GPU block, it doesn't experience the massive thermal spikes seen in high-TGP gaming laptops.`
        };
      }
      if (qLower.includes('vram') || qLower.includes('memory') || qLower.includes('ram') || qLower.includes('70b')) {
        return {
          answer: `For running large models like **Llama-3-70B** locally, **VRAM is the primary bottleneck**. 

A Windows laptop with an **NVIDIA RTX 4090 Mobile** is limited to **16GB VRAM**, which can only run quantized 8B models or highly compressed 13B models. 

The **Apple MacBook Pro Max** supports up to **128GB or 192GB Unified Memory**, where up to 75% can be allocated directly as VRAM. Redditors point out that for local LLM inference, Apple Silicon is currently the only viable laptop path for large parameter models.`
        };
      }
      if (qLower.includes('cuda') || qLower.includes('pytorch') || qLower.includes('train')) {
        return {
          answer: `For model training, custom PyTorch development, and writing CUDA kernels, the Reddit ML community strongly recommends **NVIDIA GPUs** (e.g., RTX 4080/4090 Mobile in Windows laptops like the **Legion Pro 7i**). 

While Apple Silicon supports acceleration via PyTorch's Metal Performance Shaders (MPS), many cutting-edge libraries (like FlashAttention, DeepSpeed, and bitsandbytes for quantization) are built specifically for CUDA. If you are doing active deep learning research rather than just API integrations or LLM inference, a Windows NVIDIA laptop is preferred.`
        };
      }
      return {
        answer: `The analyzed Reddit threads focus heavily on the trade-offs between **Apple MacBook Pro Max** (massive unified memory for local inference, long battery life, silent) and **NVIDIA RTX 4090/4080 laptops** like the **Legion Pro 7i** (native CUDA support for training, loud fans, short battery). 

Let me know if you want details on local VRAM allocations, CUDA compatibility, or cooling benchmarks!`
      };
    }

    // Default chat responder
    return {
      answer: `Based on the retrieved sources for "${question}", Redditors emphasize that balancing budget against specific performance bottlenecks (like VRAM, cooling, or climate) is key. Most users advocate for buying hardware that matches your primary daily workflow rather than theoretical edge cases. 

Is there a specific detail or comparison you'd like me to extract from the discussions?`
    };
  }

  // Real API implementation
  try {
    const response = await apiClient.post<ChatResponse>('/api/chat', { session_id: sessionId, question });
    return response.data;
  } catch (error) {
    console.warn("Real Chat API failed, falling back to mock client chat:", error);
    // Mimic the delay and return mock responses
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return {
      answer: `[Mock Fallback] I see you are asking about "${question}". In our retrieved discussions, users highlight that reliability, real-world climate or hardware limits, and software setup are the most critical factors. Please configure a running API backend to get live model RAG answers!`
    };
  }
};
