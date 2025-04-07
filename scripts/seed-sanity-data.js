// Seed data script for Sanity CMS
// Run with: node scripts/seed-sanity-data.js

import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Sanity client configuration
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-04-01',
  useCdn: false,
});

const categories = [
  {
    _type: 'category',
    title: 'Sensory Tools',
    slug: { _type: 'slug', current: 'sensory-tools' },
    description: 'Products and resources for sensory processing needs',
    color: '#4A90E2',
  },
  {
    _type: 'category',
    title: 'ADHD Resources',
    slug: { _type: 'slug', current: 'adhd-resources' },
    description: 'Articles and products for attention regulation and focus',
    color: '#FF9500',
  },
  {
    _type: 'category',
    title: 'Autism Support',
    slug: { _type: 'slug', current: 'autism-support' },
    description: 'Resources specifically designed for autistic individuals',
    color: '#7B61FF',
  },
  {
    _type: 'category',
    title: 'Workplace Adaptations',
    slug: { _type: 'slug', current: 'workplace-adaptations' },
    description: 'Tools and strategies for neurodivergent-friendly workplaces',
    color: '#1ABC9C',
  },
];

const authors = [
  {
    _type: 'author',
    name: 'Dr. Emma Rivera',
    slug: { _type: 'slug', current: 'dr-emma-rivera' },
    bio: 'Neurodiversity advocate and researcher with a focus on inclusive design. PhD in Cognitive Psychology with 15 years of experience working with neurodivergent communities.',
    role: 'Chief Research Officer',
    social: {
      twitter: 'https://twitter.com/dremmarivera',
      linkedin: 'https://linkedin.com/in/dremmarivera',
    },
  },
  {
    _type: 'author',
    name: 'Marcus Chen',
    slug: { _type: 'slug', current: 'marcus-chen' },
    bio: 'Autistic self-advocate, product designer, and accessibility specialist. Brings lived experience and technical expertise to create better products for neurodivergent users.',
    role: 'Head of Accessibility',
    social: {
      twitter: 'https://twitter.com/marcuschen',
      linkedin: 'https://linkedin.com/in/marcuschen',
    },
  },
  {
    _type: 'author',
    name: 'Sasha Williams',
    slug: { _type: 'slug', current: 'sasha-williams' },
    bio: 'Educational specialist with ADHD who focuses on practical strategies for neurodivergent learners and families. Former special education teacher and parent coach.',
    role: 'Education Consultant',
    social: {
      twitter: 'https://twitter.com/sashawilliams',
      instagram: 'https://instagram.com/sashawilliamsedu',
    },
  },
];

const blogPosts = [
  {
    _type: 'post',
    title: 'Understanding Sensory Processing: A Guide for Parents and Educators',
    slug: { _type: 'slug', current: 'understanding-sensory-processing' },
    publishedAt: new Date('2025-03-15').toISOString(),
    excerpt: 'Learn about sensory processing differences, how to identify them, and strategies to support sensory needs in various environments.',
    tags: ['sensory processing', 'parenting', 'education', 'sensory tools'],
    content: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Sensory processing refers to how our nervous system receives messages from the senses and turns them into appropriate motor and behavioral responses.',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'h2',
        children: [
          {
            _type: 'span',
            text: 'What is Sensory Processing?',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Sensory processing is the way our brains interpret and respond to sensory information. Many neurodivergent individuals experience differences in how they process sensory input, which can affect their comfort and functioning in various environments.',
          },
        ],
        markDefs: [],
      },
    ],
  },
  {
    _type: 'post',
    title: 'Creating ADHD-Friendly Workspaces: Productivity by Design',
    slug: { _type: 'slug', current: 'adhd-friendly-workspaces' },
    publishedAt: new Date('2025-03-25').toISOString(),
    excerpt: 'Practical tips for designing physical and digital workspaces that support focus, organization, and productivity for people with ADHD.',
    tags: ['ADHD', 'workplace', 'productivity', 'organization'],
    content: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'The workspace environment can significantly impact focus and productivity, especially for those with ADHD. This article explores evidence-based approaches to workspace design.',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'h2',
        children: [
          {
            _type: 'span',
            text: 'Physical Workspace Considerations',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Creating an environment that minimizes distractions while providing the right amount of stimulation is key for ADHD-friendly workspaces. Consider these elements when setting up your workspace:',
          },
        ],
        markDefs: [],
      },
    ],
  },
  {
    _type: 'post',
    title: 'Navigating Social Situations: Strategies for Autistic Adults',
    slug: { _type: 'slug', current: 'navigating-social-situations-autism' },
    publishedAt: new Date('2025-04-01').toISOString(),
    excerpt: 'Practical approaches for managing social interactions, understanding social cues, and advocating for your needs in various situations.',
    tags: ['autism', 'social skills', 'self-advocacy', 'communication'],
    content: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Social interactions can be challenging but rewarding for many autistic adults. This guide offers strategies based on both research and lived experience.',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'h2',
        children: [
          {
            _type: 'span',
            text: 'Understanding Social Expectations',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Social situations often involve unwritten rules that can be difficult to intuit. Recognizing these patterns can help make interactions more predictable and less stressful.',
          },
        ],
        markDefs: [],
      },
    ],
  },
  {
    _type: 'post',
    title: 'The Benefits of Weighted Blankets: Science and Personal Experience',
    slug: { _type: 'slug', current: 'benefits-weighted-blankets' },
    publishedAt: new Date('2025-04-05').toISOString(),
    excerpt: 'How weighted blankets work, what the research says about their effectiveness, and tips for choosing the right one for your needs.',
    tags: ['sensory tools', 'sleep', 'anxiety', 'product reviews'],
    content: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Weighted blankets have gained popularity as a tool for improving sleep and reducing anxiety. This article explores how they work and who might benefit from using them.',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'h2',
        children: [
          {
            _type: 'span',
            text: 'How Weighted Blankets Work',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Weighted blankets use deep pressure stimulation (DPS) to create a calming effect on the nervous system. This pressure can help reduce anxiety and promote relaxation by triggering the release of serotonin and decreasing cortisol levels.',
          },
        ],
        markDefs: [],
      },
    ],
  },
  {
    _type: 'post',
    title: 'Executive Functioning Strategies for Work and Study',
    slug: { _type: 'slug', current: 'executive-functioning-strategies' },
    publishedAt: new Date('2025-04-10').toISOString(),
    excerpt: 'Practical techniques to improve planning, organization, time management, and task completion for neurodivergent individuals.',
    tags: ['executive functioning', 'productivity', 'organization', 'ADHD'],
    content: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Executive functioning skills are crucial for success in work and academic environments, but many neurodivergent individuals face challenges in these areas. This guide offers practical solutions.',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'h2',
        children: [
          {
            _type: 'span',
            text: 'Understanding Executive Functions',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Executive functions are cognitive processes that help us plan, focus attention, remember instructions, and juggle multiple tasks. They include skills like working memory, flexible thinking, and self-control.',
          },
        ],
        markDefs: [],
      },
    ],
  },
];

// Associate posts with authors and categories
const enhancedBlogPosts = blogPosts.map((post, index) => {
  // Assign an author reference
  const authorRef = {
    _type: 'reference',
    _ref: `author-${index % authors.length}` // Cycle through authors
  };
  
  // Assign 1-2 category references
  const categoryRefs = [
    {
      _type: 'reference',
      _ref: `category-${index % categories.length}` // Primary category based on index
    }
  ];
  
  // Add a second category for some posts
  if (index % 2 === 0) {
    categoryRefs.push({
      _type: 'reference',
      _ref: `category-${(index + 1) % categories.length}` // Secondary category
    });
  }
  
  return {
    ...post,
    author: authorRef,
    categories: categoryRefs
  };
});

// Function to add documents with custom IDs
async function createDocumentsWithIds(documents, type) {
  console.log(`Creating ${documents.length} ${type} documents...`);
  
  const transaction = client.transaction();
  
  documents.forEach((doc, index) => {
    const docId = `${type}-${index}`;
    transaction.createOrReplace({
      _id: docId,
      ...doc
    });
  });
  
  await transaction.commit();
  console.log(`✅ ${type} documents created successfully!`);
}

// Main function to seed data
async function seedData() {
  try {
    console.log('Starting Sanity data seeding...');
    
    // Create authors
    await createDocumentsWithIds(authors, 'author');
    
    // Create categories
    await createDocumentsWithIds(categories, 'category');
    
    // Create blog posts
    await createDocumentsWithIds(enhancedBlogPosts, 'post');
    
    console.log('✅ All data has been successfully seeded!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

seedData();