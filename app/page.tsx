import dynamic from "next/dynamic";

const LoginForm = dynamic(() => import("./components/LoginForm"), {
  ssr: false, // render only on client
});

export default function Home() {
  return (
    <div>
      <LoginForm />
    </div>
  );
}
