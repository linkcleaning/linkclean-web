import React, { useState, useEffect } from 'react';
import { CleaningTipPost, TipCategory, TipPostType, ServiceType } from '../types';
import { INITIAL_TIPS_POSTS } from '../data/initialTipsData';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  PenSquare, 
  Search, 
  Heart, 
  Eye, 
  Tag, 
  X, 
  Calendar, 
  ChevronRight, 
  CheckCircle2, 
  Gift, 
  BookOpen, 
  ArrowRight,
  Share2,
  Check,
  UserCheck
} from 'lucide-react';

const CATEGORY_TABS: { id: TipCategory | 'all'; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'mold', label: '결로·곰팡이' },
  { id: 'kitchen', label: '주방 케어' },
  { id: 'window', label: '창틀·유리창' },
  { id: 'bathroom', label: '욕실·물때' },
  { id: 'movein', label: '입주 분진' },
  { id: 'event', label: '이벤트·혜택' },
];

const PRESET_IMAGES = [
  { label: '주방 후드', url: '/images/kitchen_hood_after.jpg?v=2' },
  { label: '욕실 타일', url: '/images/bathroom_after.jpg?v=2' },
  { label: '입주 거실', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
  { label: '쓰레기집 복원', url: '/images/trash_house_after.jpg?v=2' },
  { label: '피톤치드 살균', url: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80' },
];

export const CleaningTipsBoard: React.FC = () => {
  const { goToReservationWithService, currentUser } = useApp();

  // Posts State (Local storage synced)
  const [posts, setPosts] = useState<CleaningTipPost[]>(() => {
    try {
      const saved = localStorage.getItem('linkclean_tips_posts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Check if any default initial post is missing (e.g., tip-6)
          const missingInitials = INITIAL_TIPS_POSTS.filter(
            (init) => !parsed.some((p: CleaningTipPost) => p.id === init.id)
          );
          if (missingInitials.length > 0) {
            const merged = [...parsed, ...missingInitials];
            localStorage.setItem('linkclean_tips_posts', JSON.stringify(merged));
            return merged;
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load tips posts from localStorage', e);
    }
    return INITIAL_TIPS_POSTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('linkclean_tips_posts', JSON.stringify(posts));
    } catch (e) {
      console.error('Failed to save tips posts to localStorage', e);
    }
  }, [posts]);

  // Filters
  const [typeFilter, setTypeFilter] = useState<'all' | TipPostType>('all');
  const [categoryFilter, setCategoryFilter] = useState<TipCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [activeModalPost, setActiveModalPost] = useState<CleaningTipPost | null>(null);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Write Form State
  const [formType, setFormType] = useState<TipPostType>('info');
  const [formCategory, setFormCategory] = useState<TipCategory>('mold');
  const [formTitle, setFormTitle] = useState('');
  const [formSummary, setFormSummary] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formKeyPoints, setFormKeyPoints] = useState('');
  const [formAuthorName, setFormAuthorName] = useState(currentUser?.name || '강민우 시공팀장');
  const [formAuthorRole, setFormAuthorRole] = useState('제주본부 친환경 청소 마스터');
  const [formTags, setFormTags] = useState('제주청소, 곰팡이방지');
  const [formImageUrl, setFormImageUrl] = useState(PRESET_IMAGES[0].url);
  const [formPromoBadge, setFormPromoBadge] = useState('선착순 혜택');
  const [formPromoActionText, setFormPromoActionText] = useState('프로모션 혜택으로 견적 예약');
  const [formServiceLink, setFormServiceLink] = useState<ServiceType>('move-in');
  const [formError, setFormError] = useState('');

  // Filtered Posts
  const filteredPosts = posts.filter((post) => {
    if (typeFilter !== 'all' && post.type !== typeFilter) return false;
    if (categoryFilter !== 'all' && post.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchSummary = post.summary.toLowerCase().includes(q);
      const matchAuthor = post.authorName.toLowerCase().includes(q);
      const matchTags = post.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchSummary && !matchAuthor && !matchTags) return false;
    }
    return true;
  });

  // Like Toggle
  const handleToggleLike = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
    );
    if (activeModalPost && activeModalPost.id === postId) {
      setActiveModalPost((prev) => (prev ? { ...prev, likes: prev.likes + 1 } : null));
    }
  };

  // Open Detail
  const handleOpenDetail = (post: CleaningTipPost) => {
    // Increment view count
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, views: p.views + 1 } : p))
    );
    setActiveModalPost({ ...post, views: post.views + 1 });
  };

  // Submit New Post
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError('제목을 입력해주세요.');
      return;
    }
    if (!formContent.trim()) {
      setFormError('상세 내용(본문)을 입력해주세요.');
      return;
    }

    const catObj = CATEGORY_TABS.find((c) => c.id === formCategory);
    const categoryLabel = catObj && catObj.id !== 'all' ? catObj.label : '실전 청소';

    const rawPoints = formKeyPoints
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const rawTags = formTags
      .split(/[,#\s]+/)
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const newPost: CleaningTipPost = {
      id: `tip-${Date.now()}`,
      type: formType,
      category: formCategory,
      categoryLabel,
      title: formTitle.trim(),
      summary: formSummary.trim() || formContent.slice(0, 80) + '...',
      content: formContent.trim(),
      keyPoints: rawPoints.length > 0 ? rawPoints : undefined,
      authorName: formAuthorName.trim() || '링크클린 전문가',
      authorRole: formAuthorRole.trim() || '제주 현장 시공팀',
      authorAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      date: new Date().toISOString().slice(0, 10),
      views: 1,
      likes: 0,
      tags: rawTags.length > 0 ? rawTags : ['제주청소', '링크클린'],
      badge: formType === 'promo' ? '이벤트' : '새로운 팁',
      imageUrl: formImageUrl || PRESET_IMAGES[0].url,
      promoBadge: formType === 'promo' ? formPromoBadge : undefined,
      promoActionText: formType === 'promo' ? formPromoActionText : undefined,
      serviceLink: formType === 'promo' ? formServiceLink : undefined,
    };

    setPosts([newPost, ...posts]);
    setIsWriteModalOpen(false);
    setFormError('');

    // Reset Form fields
    setFormTitle('');
    setFormSummary('');
    setFormContent('');
    setFormKeyPoints('');

    // Open detail modal to preview newly created post!
    setActiveModalPost(newPost);
  };

  const copyPostUrl = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <section id="cleaning-tips-board" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Board Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#0284C7] bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              EXPERT CLEANING TIPS & NEWS
            </span>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              정보성 & 프로모션 통합 매거진
            </span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-[#0A1D37] tracking-tight">
            전문가 청소 팁 & 제주 혜택 소식
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            염분과 습도가 높은 제주 기후 맞춤 실전 청소 노하우와 링크클린의 단독 프로모션을 한곳에서 확인하세요.
          </p>
        </div>

        {/* Right CTA Button: Write Post Immediately */}
        <button
          onClick={() => {
            setFormError('');
            setIsWriteModalOpen(true);
          }}
          className="self-start sm:self-auto px-4 py-2.5 bg-[#0A1D37] hover:bg-[#1E293B] text-white rounded-2xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <PenSquare className="w-4 h-4 text-[#38BDF8]" />
          <span>팁 / 소식 바로 등록하기</span>
        </button>
      </div>

      {/* Filter Bar: Segmented Type Toggle & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        {/* Type Segmented Buttons: 전체 / 📘 정보성 꿀팁 / 🎁 혜택·프로모션 */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-2xl w-fit">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              typeFilter === 'all'
                ? 'bg-white text-[#0A1D37] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            전체 보기 ({posts.length})
          </button>
          <button
            onClick={() => setTypeFilter('info')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              typeFilter === 'info'
                ? 'bg-[#0284C7] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>정보성 꿀팁 ({posts.filter((p) => p.type === 'info').length})</span>
          </button>
          <button
            onClick={() => setTypeFilter('promo')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              typeFilter === 'promo'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>이벤트 & 혜택 ({posts.filter((p) => p.type === 'promo').length})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="키워드, 곰팡이, 주방, 이벤트 검색"
            className="w-full pl-9.5 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-hidden focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex overflow-x-auto gap-1.5 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 mb-6 no-scrollbar">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCategoryFilter(tab.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
              categoryFilter === tab.id
                ? 'bg-[#0A1D37] text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Posts Cards Grid */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-2xs space-y-3">
          <p className="text-slate-400 text-sm">해당 조건에 맞는 청소 팁이나 소식이 없습니다.</p>
          <button
            onClick={() => {
              setTypeFilter('all');
              setCategoryFilter('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200"
          >
            필터 초기화
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => handleOpenDetail(post)}
              className="bg-white rounded-3xl border border-slate-100 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group cursor-pointer"
            >
              {/* Image & Badges */}
              <div className="relative h-44 bg-slate-100 overflow-hidden">
                {post.imageUrl ? (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400">
                    <BookOpen className="w-8 h-8" />
                  </div>
                )}

                {/* Type Badge Overlay */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  {post.type === 'promo' ? (
                    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm">
                      <Gift className="w-3 h-3" />
                      이벤트 & 프로모션
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-[#0284C7] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm">
                      <BookOpen className="w-3 h-3" />
                      전문가 실전 꿀팁
                    </span>
                  )}
                  <span className="bg-white/90 backdrop-blur-xs text-[#0A1D37] text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                    {post.categoryLabel}
                  </span>
                </div>

                {/* Like floating pill */}
                <button
                  type="button"
                  onClick={(e) => handleToggleLike(e, post.id)}
                  className="absolute top-3 right-3 p-1.5 bg-white/90 backdrop-blur-xs hover:bg-white rounded-full text-slate-500 hover:text-rose-500 shadow-2xs transition-colors flex items-center gap-1 text-[11px] font-semibold"
                >
                  <Heart className={`w-3.5 h-3.5 ${post.likes > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{post.likes}</span>
                </button>
              </div>

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-mono">{post.date}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {post.views}회 조회
                    </span>
                  </div>

                  <h3 className="font-bold text-[#0A1D37] text-sm sm:text-base leading-snug group-hover:text-[#0284C7] transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {post.summary}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {post.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer: Author & Action */}
              <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-200 shrink-0">
                    <img
                      src={post.authorAvatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80'}
                      alt={post.authorName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#0A1D37] truncate">{post.authorName}</div>
                    <div className="text-[10px] text-slate-400 truncate">{post.authorRole}</div>
                  </div>
                </div>

                <div className="text-xs font-bold text-[#0284C7] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 shrink-0">
                  <span>읽기</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =========================================================================
          MODAL 1 — DETAIL ARTICLE VIEWER
      ========================================================================= */}
      {activeModalPost && (
        <div className="fixed inset-0 z-50 bg-[#0A1D37]/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 relative animate-in fade-in duration-200 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setActiveModalPost(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header badges */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {activeModalPost.type === 'promo' ? (
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
                    <Gift className="w-3.5 h-3.5" />
                    {activeModalPost.promoBadge || '이벤트 & 혜택'}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-[#0284C7] text-white text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
                    <BookOpen className="w-3.5 h-3.5" />
                    전문가 실전 청소 가이드
                  </span>
                )}
                <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full">
                  {activeModalPost.categoryLabel}
                </span>
                <span className="text-xs text-slate-400 font-mono ml-auto">
                  {activeModalPost.date}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#0A1D37] leading-snug">
                {activeModalPost.title}
              </h2>

              {/* Author Strip */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                <div className="flex items-center gap-2.5">
                  <img
                    src={activeModalPost.authorAvatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80'}
                    alt={activeModalPost.authorName}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <div className="text-xs font-bold text-[#0A1D37] flex items-center gap-1">
                      <span>{activeModalPost.authorName}</span>
                      <UserCheck className="w-3 h-3 text-[#0284C7]" />
                    </div>
                    <div className="text-[11px] text-slate-400">{activeModalPost.authorRole}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleToggleLike(e, activeModalPost.id)}
                    className="px-3 py-1.5 rounded-full border border-slate-200 hover:border-rose-200 text-xs font-semibold text-slate-600 hover:text-rose-500 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Heart className={`w-3.5 h-3.5 ${activeModalPost.likes > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>좋아요 {activeModalPost.likes}</span>
                  </button>
                  <button
                    onClick={copyPostUrl}
                    className="p-1.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors cursor-pointer"
                    title="링크 복사"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Post Image */}
            {activeModalPost.imageUrl && (
              <div className="rounded-2xl overflow-hidden max-h-72 bg-slate-100">
                <img
                  src={activeModalPost.imageUrl}
                  alt={activeModalPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Key Takeaways Box */}
            {activeModalPost.keyPoints && activeModalPost.keyPoints.length > 0 && (
              <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0284C7]">
                  <Sparkles className="w-4 h-4" />
                  <span>핵심 체크포인트</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {activeModalPost.keyPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Main Content */}
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-4">
              {activeModalPost.content}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
              {activeModalPost.tags.map((t, idx) => (
                <span key={idx} className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                  #{t}
                </span>
              ))}
            </div>

            {/* Modal Bottom CTA Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#0A1D37] to-[#1E293B] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-[#38BDF8] mb-0.5">
                  {activeModalPost.type === 'promo' ? '🎁 프로모션 혜택 적용' : '✨ 전문가 직접 시공'}
                </div>
                <div className="text-sm font-bold">
                  {activeModalPost.type === 'promo'
                    ? '제주 전지역 무료 방문 견적 예약 시 즉시 혜택이 적용됩니다.'
                    : '혼자 하기 힘든 청소, 링크클린 베테랑 팀장이 해결해 드립니다.'}
                </div>
              </div>

              <button
                onClick={() => {
                  const service = activeModalPost.serviceLink || 'move-in';
                  setActiveModalPost(null);
                  goToReservationWithService?.(service);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#0A1D37] font-extrabold text-xs shadow-md transition-colors cursor-pointer shrink-0 flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-4 h-4" />
                <span>{activeModalPost.promoActionText || '전문가 방문 견적 신청하기'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2 — WRITE TIP / PROMOTION (바로 올릴 수 있는 글쓰기)
      ========================================================================= */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0A1D37]/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-5 relative animate-in fade-in duration-200 max-h-[90vh] overflow-y-auto">
            {/* Close */}
            <button
              onClick={() => setIsWriteModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold text-[#0284C7] bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
                실시간 콘텐츠 등록
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0A1D37] mt-2">
                청소 팁 & 프로모션 바로 등록하기
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                전문가만의 실전 청소 노하우(정보성) 또는 고객 혜택 이벤트(홍보성)를 바로 게시할 수 있습니다.
              </p>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreatePost} className="space-y-4">
              {/* Type Selection (정보성 vs 홍보성) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  글 유형 선택 <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormType('info')}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      formType === 'info'
                        ? 'border-[#0284C7] bg-sky-50 text-[#0284C7] shadow-2xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>📘 실전 청소 꿀팁 (정보성)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormType('promo')}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      formType === 'promo'
                        ? 'border-rose-500 bg-rose-50 text-rose-600 shadow-2xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Gift className="w-4 h-4" />
                    <span>🎁 프로모션 & 이벤트 (홍보성)</span>
                  </button>
                </div>
              </div>

              {/* Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    카테고리 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as TipCategory)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden focus:border-[#0284C7]"
                  >
                    <option value="mold">결로·곰팡이 케어</option>
                    <option value="kitchen">주방 기름때·후드</option>
                    <option value="window">창틀·유리창·해풍</option>
                    <option value="bathroom">욕실·타일 물때</option>
                    <option value="movein">신축 입주·이사 분진</option>
                    <option value="aircon">에어컨·가전 케어</option>
                    <option value="event">프로모션·이벤트</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    작성자 이름 / 직책
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formAuthorName}
                      onChange={(e) => setFormAuthorName(e.target.value)}
                      placeholder="이름"
                      className="w-1/2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-[#0284C7]"
                    />
                    <input
                      type="text"
                      value={formAuthorRole}
                      onChange={(e) => setFormAuthorRole(e.target.value)}
                      placeholder="소속/직책"
                      className="w-1/2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-[#0284C7]"
                    />
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  제목 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder={
                    formType === 'info'
                      ? '예: 바닷가 아파트 창틀 소금기 굳은 때 10분 만에 녹이는 프로의 팁'
                      : '예: [9월 가을맞이 특가] 입주청소 예약 시 친환경 피톤치드 연무 소독 무료 지원'
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-[#0284C7]"
                />
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  한 줄 요약
                </label>
                <input
                  type="text"
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  placeholder="목록 카드에 표시될 요약 문장"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-[#0284C7]"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  상세 내용 (본문) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={6}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="노하우, 단계별 청소 방법, 또는 프로모션 혜택 내용과 신청 방법을 자세히 입력하세요."
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed focus:bg-white focus:outline-hidden focus:border-[#0284C7]"
                />
              </div>

              {/* Key Points */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  핵심 체크포인트 (줄바꿈으로 구분)
                </label>
                <textarea
                  rows={3}
                  value={formKeyPoints}
                  onChange={(e) => setFormKeyPoints(e.target.value)}
                  placeholder="예:&#10;1. 락스 도포 전 표면 물기 100% 제거&#10;2. 고점도 젤 타입 약품 2시간 방치&#10;3. 미온수로 잔류염 완전 헹굼"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-[#0284C7]"
                />
              </div>

              {/* Promo Exclusive Fields */}
              {formType === 'promo' && (
                <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
                  <div className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5" />
                    <span>홍보/프로모션 전용 설정</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        혜택 뱃지 문구
                      </label>
                      <input
                        type="text"
                        value={formPromoBadge}
                        onChange={(e) => setFormPromoBadge(e.target.value)}
                        placeholder="예: 선착순 30세대 한정"
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        버튼 안내 문구
                      </label>
                      <input
                        type="text"
                        value={formPromoActionText}
                        onChange={(e) => setFormPromoActionText(e.target.value)}
                        placeholder="예: 피톤치드 혜택받고 예약하기"
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      연결 청소 서비스
                    </label>
                    <select
                      value={formServiceLink}
                      onChange={(e) => setFormServiceLink(e.target.value as ServiceType)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    >
                      <option value="move-in">입주·이사청소</option>
                      <option value="residential">거주청소</option>
                      <option value="commercial">상가청소</option>
                      <option value="office">사무실청소</option>
                      <option value="partial">부분청소</option>
                      <option value="trash">쓰레기집청소</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Image Selection Presets */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  대표 이미지 선택
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {PRESET_IMAGES.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFormImageUrl(img.url)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all cursor-pointer ${
                        formImageUrl === img.url
                          ? 'border-[#0284C7] bg-sky-50 text-[#0284C7] font-bold'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="직접 이미지 URL 입력"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  해시태그 (쉼표로 구분)
                </label>
                <input
                  type="text"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  placeholder="예: 제주청소, 곰팡이제거, 입주청소할인"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-[#0284C7]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>게시판에 바로 등록하기</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
