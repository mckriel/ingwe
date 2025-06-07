// app/ui/components/footer/Newsletter.tsx
export default function Newsletter() {
    return (
      <div className="flex flex-col justify-center pl-8">
        <h2 className="text-4xl font-normal mb-6 text-white">
          Newsletter
        </h2>
        <p className="text-[#B8C332] mb-8 leading-relaxed">
          In hac habitasse platea dictumst. Curabitur condimentum porta lacus, eget facilisis enim vulputate id. Vivamus et mi et
        </p>
        <form className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            placeholder="Your Email"
            className="flex-1 px-6 py-4 rounded-xl bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#B8C332] border-0"
          />
          <button
            type="submit"
            className="bg-[#B8C332] hover:bg-[#a6b02e] text-white px-8 py-4 rounded-xl font-medium transition-colors"
          >
            Sign Up Now
          </button>
        </form>
      </div>
    );
}
  