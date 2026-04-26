'use client'
import React from 'react'
import { LoaderCircle, Image as ImageIcon } from 'lucide-react'

export default function CreatePostBox({
  user,
  postText,
  setPostText,
  postImages,
  postImageRef,
  handlePostImageChange,
  removePostImage,
  handleCreatePost,
  isPosting,
}: any) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex gap-4">
        <img
          src={(user?.avatar && user.avatar.startsWith('http') ? user.avatar : '/avatar.png')}
          alt="user"
          className="w-11 h-11 rounded-full object-cover border"
        />
        <div className="w-full">
          <textarea
            placeholder="What's happening?"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            className="w-full bg-transparent text-lg placeholder-gray-500 resize-none outline-none focus:ring-0 min-h-[60px] pt-2"
          />

          {postImages.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-3">
              {postImages.map((file: File, idx: number) => (
                <div key={idx} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-full h-40 rounded-xl object-cover border"
                  />
                  <button
                    onClick={() => removePostImage(idx)}
                    className="absolute top-2 right-2 bg-gray-900/70 hover:bg-gray-900 cursor-pointer text-white p-1.5 rounded-full backdrop-blur-sm transition opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
            <div className="flex gap-2">
              <button
                onClick={() => postImageRef.current?.click()}
                className="text-green-600 cursor-pointer hover:bg-green-50 p-2 rounded-full transition"
                title="Add Photo"
              >
                <ImageIcon size={20} />
              </button>
              <input
                type="file"
                ref={postImageRef}
                hidden
                multiple
                onChange={handlePostImageChange}
                accept="image/*"
              />
            </div>

            <button
              onClick={handleCreatePost}
              disabled={isPosting || (!postText.trim() && postImages.length === 0)}
              className="bg-green-600 hover:bg-green-700 cursor-pointer text-white px-6 py-2 rounded-full font-bold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm shadow-green-200"
            >
              {isPosting ? <><LoaderCircle className="animate-spin" size={16} /> Posting</> : 'Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
