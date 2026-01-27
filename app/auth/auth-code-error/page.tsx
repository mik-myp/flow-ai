import { Button, Result } from "antd";
import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <Result
      className="flex h-screen flex-col items-center justify-center bg-slate-50 p-6"
      status="error"
      title="授权失败"
      subTitle="登录过程中出现问题，请稍后重试。"
      extra={[
        <Link href="/login" key="login">
          <Button type="primary">返回登录</Button>
        </Link>,
      ]}
    />
  );
}
