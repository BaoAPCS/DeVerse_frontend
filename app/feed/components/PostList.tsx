'use client'
import React from 'react'
import PostItem from './PostItem'

export default function PostList({
  posts,
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
    <div className="space-y-6">
      {posts.length === 0 ? (
        <div className="text-center text-gray-500 py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
          <p className="font-medium text-lg">No posts yet</p>
          <p className="text-sm">Be the first to share something!</p>
        </div>
      ) : (
        posts.map((post: any) => (
          <PostItem
            key={post._id}
            post={post}
            user={user}
            expandedComments={expandedComments}
            toggleComments={toggleComments}
            handleToggleLike={handleToggleLike}
            handleDeletePost={handleDeletePost}
            commentInputs={commentInputs}
            setCommentInputs={setCommentInputs}
            handlePostComment={handlePostComment}
            handleDeleteComment={handleDeleteComment}
            getImageUrl={getImageUrl}
          />
        ))
      )}
    </div>
  )
}
