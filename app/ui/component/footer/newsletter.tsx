// app/ui/components/footer/Newsletter.tsx
export default function Newsletter() {
    return (
      <div className="flex flex-col justify-center">
        <h2 className="text-3xl font-semibold mb-4 text-white">
          Newsletter
        </h2>
        <p className="text-[#A3D92D] mb-6">
          In hac habitasse platea dictumst. Curabitur condimentum porta lacus, eget facilisis enim vulputate id. Vivamus et mi et ...
        </p>
        <form className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            placeholder="Your Email"
            className="flex-1 px-4 py-2 rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A3D92D]"
          />
          <button
            type="submit"
            className="bg-[#A3D92D] hover:bg-[#92c12a] text-white px-6 py-2 rounded transition-colors"
          >
            Sign Up Now
          </button>
        </form>
      </div>
    );
}
  