import { Button, Result } from "antd";
import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <Result
      className="bg-muted/50 flex h-screen flex-col items-center justify-center p-4"
      status="error"
      title="授权登录失败"
      subTitle="很抱歉，登录过程中出现了问题，请尝试重新登录."
      extra={[
        <Link href="/login" key="login">
          <Button color="default" variant="solid">
            返回登录页面
          </Button>
        </Link>,
      ]}
    />
  );
}
