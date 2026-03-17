export type InstagramMediaItem = {
  shortcode: string
  url: string
  views: number | null
  likes: number
  comments: number
  imageUrl: string
}

export const INSTAGRAM_PROFILE = {
  handle: "godspeed_gym",
  profileImageUrl: "/images/instagram/logo.jpg",
  bio: "Gym 🏋️‍♀️ · We help to transform your physique in 60 days · Health and fitness · Personal training · Ponda Goa",
  url: "https://www.instagram.com/godspeed_gym/",
}

export const TOP_VIEWED_VIDEOS: InstagramMediaItem[] = [
  {
    shortcode: "DVy5DfwDHZr",
    url: "https://www.instagram.com/p/DVy5DfwDHZr/",
    views: 1441,
    likes: 371,
    comments: 34,
    imageUrl: "/images/instagram/video-1.jpg",
  },
  {
    shortcode: "DVQmt9TCI5hsEhHJNM6Txn593fDr2l2TQpxhAI0",
    url: "https://www.instagram.com/p/DVQmt9TCI5hsEhHJNM6Txn593fDr2l2TQpxhAI0/",
    views: 1209,
    likes: 238,
    comments: 12,
    imageUrl: "/images/instagram/video-2.jpg",
  },
  {
    shortcode: "DVP-LT4DMAHAqRBn5NoffVZ7AQT0RdlAYpez2o0",
    url: "https://www.instagram.com/p/DVP-LT4DMAHAqRBn5NoffVZ7AQT0RdlAYpez2o0/",
    views: 904,
    likes: 145,
    comments: 10,
    imageUrl: "/images/instagram/video-3.jpg",
  },
]

export const TOP_LIKED_POSTS: InstagramMediaItem[] = [
  {
    shortcode: "C2WNwUtojTF",
    url: "https://www.instagram.com/p/C2WNwUtojTF/",
    views: null,
    likes: 1906,
    comments: 18,
    imageUrl: "/images/instagram/post-1.jpg",
  },
  {
    shortcode: "CtGaLWXtSF1",
    url: "https://www.instagram.com/p/CtGaLWXtSF1/",
    views: null,
    likes: 505,
    comments: 4,
    imageUrl: "/images/instagram/post-2.jpg",
  },
  {
    shortcode: "DVQKb2FESj9",
    url: "https://www.instagram.com/p/DVQKb2FESj9/",
    views: null,
    likes: 434,
    comments: 2,
    imageUrl: "/images/instagram/post-3.jpg",
  },
]
