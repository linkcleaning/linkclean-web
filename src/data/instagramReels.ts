/**
 * 홈페이지 "오늘의 링크클린 새소식" 끝에 보여줄 인스타 릴스 (맨 위 1개만 표시)
 * ▸ 새 릴스로 바꾸려면 url·caption을 바꾸고, 표지 사진을 public/insta/ 에 넣어 thumbnail 경로를 적습니다.
 * ▸ 인스타 토큰(INSTAGRAM_TOKEN)을 깃허브에 넣어두면 3시간마다 자동으로 최신 게시물을 가져오고,
 *   이 목록은 토큰이 없거나 실패할 때 대신 쓰입니다.
 */
export interface InstaPost {
  url: string;
  caption?: string;
  thumbnail?: string;
  date?: string;
}

export const INSTAGRAM_PROFILE = 'https://www.instagram.com/linkcleaning/';

export const INSTAGRAM_REELS: InstaPost[] = [
  {
    url: 'https://www.instagram.com/reel/DemXO4SMCv1/',
    caption: '화장실 물때, 색깔부터 보세요',
    thumbnail: '/insta/DemXO4SMCv1.jpg',
  },
];
