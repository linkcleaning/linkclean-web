/**
 * 홈페이지 "링크클린 인스타 릴스" 칸에 보여줄 게시물 (최신이 맨 위)
 * ▸ 인스타에 새 릴스를 올리면 링크를 맨 위에 한 줄 추가하면 됩니다.
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
  { url: 'https://www.instagram.com/reel/DemXO4SMCv1/', caption: '링크클린 현장 릴스' },
  { url: 'https://www.instagram.com/reel/CyuliQvLjOB/', caption: '링크클린 현장 릴스' },
  { url: 'https://www.instagram.com/p/DXRdvIwmI-Y/', caption: '링크클린 게시물' },
  { url: 'https://www.instagram.com/reel/Ddxvcxos8oB/', caption: '링크클린 현장 릴스' },
  { url: 'https://www.instagram.com/reel/DW6QhHUDKvq/', caption: '링크클린 현장 릴스' },
  { url: 'https://www.instagram.com/reel/C2HyiBIS0x7/', caption: '링크클린 현장 릴스' },
  { url: 'https://www.instagram.com/p/CzIf3fHLJ7U/', caption: '링크클린 게시물' },
  { url: 'https://www.instagram.com/p/DBkpBjCyeUc/', caption: '링크클린 게시물' },
];
