"use client";
import React, { useEffect, useMemo, useState } from "react";
import { MessageSquare, Tag, Flame, Search, Users, Eye, CheckCircle } from "lucide-react";
import TopNavBar from "@/components/TopNavBar";
import ChatPanel from "@/components/ChatPanel";
import ForumSection from "@/components/ForumSection";
import Link from "next/link";

interface ThreadView {
  id: number;
  event_id: number;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  upvotes: number;
  downvotes: number;
  comments?: Array<{
    id: number;
    thread_id: number;
    event_id: number;
    user_id: string;
    content: string;
    created_at: string;
    upvotes: number;
    downvotes: number;
    parent_id?: number | null;
  }>;
}

export default function ForumPage() {
  const [hotProposals, setHotProposals] = useState<ThreadView[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [todayMessages, setTodayMessages] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/forum?eventId=1");
        const data = await res.json();
        const threads: ThreadView[] = Array.isArray(data?.threads) ? data.threads : [];
        const ranked = [...threads].sort((a, b) => (b.upvotes) - (a.upvotes));
        setHotProposals(ranked.slice(0, 20));
      } catch (e: any) {
        setError(e?.message || "加载失败");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/chat?eventId=1&limit=50");
        const data = await res.json();
        const list = Array.isArray(data?.messages) ? data.messages : [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const cnt = list.filter((m: any) => new Date(m.created_at).getTime() >= today.getTime()).length;
        setTodayMessages(cnt);
      } catch {}
    })();
  }, []);

  const todayProposals = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return hotProposals.filter(p => new Date(p.created_at).getTime() >= today.getTime()).length;
  }, [hotProposals]);

  const filteredHotProposals = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return hotProposals;
    return hotProposals.filter(p =>
      String(p.title || "").toLowerCase().includes(q) ||
      String(p.content || "").toLowerCase().includes(q)
    );
  }, [hotProposals, query]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden text-black">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 rounded-full blur-3xl"></div>
      </div>

      <TopNavBar />

      <div className="relative z-10 px-6 lg:px-10 py-6">
        {/* 轻柔浅色系头部：指标与快速入口 */}
        <div className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur p-5 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-200 to-pink-200 text-purple-700">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold">社区频道与提案</div>
                <div className="text-xs text-gray-600">交流预测思路、提交/讨论事件提案</div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200">
                <Users className="w-4 h-4" />
                今日聊天 {todayMessages}
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl bg-pink-50 text-pink-700 border border-pink-200">
                <Tag className="w-4 h-4" />
                今日提案 {todayProposals}
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Flame className="w-4 h-4" />
                提案总数 {hotProposals.length}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/trending" className="btn-base btn-sm btn-cta">返回市场</Link>
              <a href="#proposals" className="btn-base btn-sm btn-cta">快速发帖</a>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)_340px] gap-6">
          {/* 左侧：频道与分类 */}
          <aside className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm p-4 lg:sticky lg:top-24 h-fit">
            <h2 className="text-lg font-bold mb-3">频道</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'chat', name: '全站聊天', grad: 'panel-azure', icon: <MessageSquare className="w-5 h-5" />, desc: '交流与提问', total: todayMessages, today: todayMessages, href: '#global-chat' },
                { key: 'proposals', name: '事件提案', grad: 'panel-lilac', icon: <Tag className="w-5 h-5" />, desc: '提交与讨论', total: hotProposals.length, today: todayProposals, href: '#proposals' },
                { key: 'hot', name: '热门讨论', grad: 'panel-peach', icon: <Flame className="w-5 h-5" />, desc: '高热度主题', total: hotProposals.length, today: 0, href: '#hot' },
                { key: 'ann', name: '公告', grad: 'panel-mint', icon: <Eye className="w-5 h-5" />, desc: '站内通知', total: 0, today: 0, href: '#announcements' },
              ].map((c) => (
                <a key={c.key} href={c.href} className={`panel-base ${c.grad} rounded-2xl p-3 text-white`}>
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2">
                      {c.icon}
                      <span className="font-semibold">{c.name}</span>
                    </div>
                    <span className="text-xs">总数 {c.total}</span>
                  </div>
                  <div className="text-xs opacity-90 mt-1">{c.desc}</div>
                  <div className="text-xs opacity-90 mt-1">今日新增 {c.today}</div>
                </a>
              ))}
            </div>
            <h2 className="text-lg font-bold mt-6 mb-3">市场分类</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: "热门", grad: "bg-gradient-peach" },
                { name: "加密", grad: "bg-gradient-azure" },
                { name: "体育", grad: "bg-gradient-mint" },
                { name: "政治", grad: "bg-gradient-lilac" },
              ].map((c) => (
                <button key={c.name} className={`px-3 py-2 rounded-xl text-sm text-white ${c.grad}`}>{c.name}</button>
              ))}
            </div>
            <div className="mt-6">
              <a href="#proposals" className="w-full inline-flex items-center justify-center px-3 py-2 btn-base btn-md btn-cta">发起事件提案</a>
              <div className="mt-3 text-xs text-gray-600">提案需包含明确的结果判定标准与可靠结算源。</div>
            </div>
          </aside>

          {/* 中间：发帖框 + 信息流 */}
          <main className="space-y-6">
            {/* 搜索与指引 */}
            <div id="proposals" className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">事件提案</h2>
                <span className="text-xs text-gray-600">官方将对结算源进行确认并标准化标题</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                <div className="flex-1 inline-flex items-center gap-2 px-3 py-2 rounded-xl border bg-white/80">
                  <Search className="w-4 h-4 text-gray-500" />
                  <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="搜索热门提案（标题/正文）"
                    className="flex-1 outline-none text-sm bg-transparent"
                  />
                </div>
                <Link href="/trending" className="btn-base btn-sm btn-cta">去市场看看</Link>
              </div>
              {/* 复用 ForumSection，MVP绑定事件ID 1 */}
              <ForumSection eventId={1} />
            </div>

            {/* 热门讨论（浅色卡片） */}
            <div id="hot" className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-peach-100/60 text-peach-700">
                  <Flame className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-semibold">热门讨论</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredHotProposals.length === 0 && (
                  <div className="text-sm text-gray-600">暂无匹配的热门提案</div>
                )}
                {filteredHotProposals.slice(0, 8).map((p) => (
                  <div key={p.id} className="rounded-xl border bg-white/70 p-3">
                    <div className="text-sm font-medium text-gray-800 line-clamp-2">{p.title}</div>
                    <div className="text-xs text-gray-500 mt-1">由 {String(p.user_id).slice(0, 6)}… 在 {new Date(p.created_at).toLocaleDateString()} 提出</div>
                    <div className="mt-2 inline-flex items-center gap-2 text-xs text-gray-700">
                      <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700">👍 {p.upvotes}</span>
                      <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">👎 {p.downvotes}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>

          {/* 右侧：热门提案/公告/筛选/搜索/最近采纳 */}
          <aside className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm p-4 h-fit">
            <div className="mb-4">
              <h2 className="text-lg font-bold">热门提案</h2>
              {loading && <div className="text-sm text-gray-600 mt-2">加载中…</div>}
              {error && <div className="text-xs text-red-600 mt-2">{error}</div>}
              {!loading && !error && (
                <div className="mt-3 space-y-3">
                  {hotProposals.length === 0 && (
                    <div className="text-sm text-gray-600">暂无提案</div>
                  )}
                  {filteredHotProposals.map((p) => (
                    <div key={p.id} className="flex items-start justify-between p-3 rounded-xl border bg-white/70">
                      <div className="mr-3">
                        <div className="text-sm font-medium text-gray-800 line-clamp-2">{p.title}</div>
                        <div className="text-xs text-gray-500 mt-1">由 {String(p.user_id).slice(0, 6)}… 在 {new Date(p.created_at).toLocaleDateString()} 提出</div>
                      </div>
                      <div className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">👍 {p.upvotes}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div id="announcements" className="mb-4">
              <h2 className="text-lg font-bold">官方公告</h2>
              <div className="mt-2 text-sm text-gray-700 bg-white/70 border rounded-xl p-3">近期采纳的提案将通过此处公示与结算源确认；请关注置顶说明。</div>
            </div>
            <div className="mb-4">
              <h2 className="text-lg font-bold">筛选与搜索</h2>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <select className="px-3 py-2 rounded-xl border bg-white/80 text-sm">
                  <option>状态：全部</option>
                  <option>草稿</option>
                  <option>审核中</option>
                  <option>已采纳</option>
                  <option>已拒绝</option>
                  <option>待补充结算源</option>
                </select>
                <select className="px-3 py-2 rounded-xl border bg-white/80 text-sm">
                  <option>分类：全部</option>
                  <option>热门</option>
                  <option>加密</option>
                  <option>体育</option>
                  <option>政治</option>
                </select>
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="col-span-2 px-3 py-2 rounded-xl border bg-white/80 text-sm"
                  placeholder="搜索标题/正文关键字"
                />
              </div>
            </div>
            <div className="mb-2">
              <h2 className="text-lg font-bold">最近已采纳</h2>
              <div className="mt-2 space-y-2">
                {hotProposals.slice(0, 3).map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-xl border bg-white/70">
                    <span className="text-sm text-gray-800 truncate max-w-[12rem]">{p.title}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 inline-flex items-center gap-1"><CheckCircle className="w-3 h-3" />已采纳</span>
                  </div>
                ))}
                {hotProposals.length === 0 && (
                  <div className="text-sm text-gray-600">暂无记录</div>
                )}
              </div>
            </div>

            {/* 右侧内嵌：全站聊天（Mini） */}
            <div id="global-chat" className="mt-4">
              <h2 className="text-lg font-bold mb-2">全站聊天</h2>
              <ChatPanel eventId={1} />
            </div>
          </aside>
        </div>

        {/* 移除底部整行的全站聊天展示，改为右侧小组件 */}
      </div>
    </div>
  );
}
