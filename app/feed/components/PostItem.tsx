'use client'
import React from 'react'
import { Heart, MessageCircle, Trash2, Send } from 'lucide-react'

export default function PostItem({
  post,
  user,
  expandedComments,
  toggleComments,
  handleToggleLike,
  handleDeletePost,
  commentInputs,
  setCommentInputs,
  handlePostComment,
  handleDeleteComment,
  getImageUrl,
}: any) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

      {/* Post Header */}
      <div className="flex items-center justify-between p-4 pb-2">
        <div className="flex items-center gap-3">
          <img
            src={getImageUrl(post.author?.avatar) || '/avatar.png'}
            alt="author"
            className="h-10 w-10 rounded-full object-cover border border-gray-100"
          />
          <div>
            <p className="font-bold text-[15px] text-gray-900 leading-tight">
              {post.author?.name || 'Unknown User'}
            </p>
            <p className="text-[13px] text-gray-500">
              {new Date(post.createdAt).toLocaleDateString(undefined, {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        {post.author?._id === user?._id && (
          <button
            onClick={() => handleDeletePost(post._id)}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition cursor-pointer"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <div className="px-4 pb-3">
        {post.content && <p className="text-gray-800 text-[15px] whitespace-pre-wrap">{post.content}</p>}
      </div>

      {post.images && post.images.length > 0 && (
        <div className={`grid gap-1 px-4 ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {post.images.map((img: string, idx: number) => (
            <img
              key={idx}
              src={getImageUrl(img)}
              alt="Post attachment"
              className="w-full h-auto max-h-96 object-cover rounded-xl border border-gray-100 bg-gray-50"
            />
          ))}
        </div>
      )}

      <div className="px-4 py-3 mt-2 border-t border-gray-50">
        <div className="flex items-center gap-6 text-gray-500">
          <button
            onClick={() => handleToggleLike(post._id)}
            className={`flex items-center gap-2 cursor-pointer transition group ${post.isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
          >
            <div className={`p-2 rounded-full transition duration-300 ${post.isLiked ? 'bg-red-50 scale-110' : 'group-hover:bg-red-50 hover:scale-110'}`}>
              <Heart size={20} className={post.isLiked ? 'fill-current' : ''} />
            </div>
            <span className="font-medium text-[15px]">
              {post.likeCount}
            </span>
          </button>

          <button
            onClick={() => toggleComments(post._id)}
            className="flex items-center gap-2 cursor-pointer hover:text-blue-500 transition group"
          >
            <div className="p-2 rounded-full group-hover:bg-blue-50 transition duration-300 hover:scale-110">
              <MessageCircle size={20} className={expandedComments.has(post._id) ? 'fill-current text-blue-500' : ''} />
            </div>
            <span className="font-medium text-[15px]">
              {post.commentCount}
            </span>
          </button>
        </div>
      </div>

      {/* Comments */}
      {expandedComments.has(post._id) && (
        <div className="bg-gray-50 border-t border-gray-100 p-4">

          <div className="flex gap-3 mb-6">
            <img
              src={getImageUrl(user?.avatar) || '/avatar.png'}
              className="h-8 w-8 rounded-full border border-gray-200 mt-1"
            />
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentInputs[post._id] || ''}
                onChange={(e) => setCommentInputs({ ...commentInputs, [post._id]: e.target.value })}
                onKeyDown={(e) => { if (e.key === 'Enter') handlePostComment(post._id) }}
                className="w-full bg-white border border-gray-200 rounded-full pl-4 pr-12 py-2 text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition shadow-sm"
              />
              <button
                onClick={() => handlePostComment(post._id)}
                disabled={!commentInputs[post._id]?.trim()}
                className="absolute right-2 top-1.5 p-1 text-green-600 cursor-pointer disabled:text-gray-300 transition hover:scale-110"
              >
                <Send size={16} />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {post.comments?.map((comment: any) => (
              <div key={comment._id} className="flex gap-3 group">
                <img
                  src={getImageUrl(comment.author?.avatar) || '/avatar.png'}
                  className="h-8 w-8 rounded-full border border-gray-200"
                />
                <div className="flex-1 flex items-start gap-2">
                  <div className="bg-white px-4 py-2.5 rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm max-w-full">
                    <p className="text-[13px] font-bold text-gray-900 leading-tight mb-0.5">
                      {comment.author?.name || 'Unknown User'}
                    </p>
                    <p className="text-[14px] text-gray-800 leading-snug break-words">
                      {comment.content}
                    </p>
                  </div>

                  {comment.author?._id === user?._id && (
                    <button
                      onClick={() => handleDeleteComment(post._id, comment._id)}
                      className="text-gray-400 hover:text-red-500 opacity-0 cursor-pointer group-hover:opacity-100 transition mt-2 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
