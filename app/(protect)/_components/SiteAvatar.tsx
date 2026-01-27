"use client";

import { createClient } from "@/lib/supabase/client";
import { IUser } from "@/types/user";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Divider, Dropdown, MenuProps, Skeleton, theme } from "antd";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useEffect, useState } from "react";
const { useToken } = theme;

const SiteAvatar = () => {
  const supabase = createClient();

  const [userInfo, setUserInfo] = useState<IUser | null>();
  const [loading, setLoading] = useState(true);

  const { token } = useToken();

  const router = useRouter();

  const items: MenuProps["items"] = [
    {
      key: "logout",
      label: "登出",
      icon: <LogOut size={16} />,
      onClick: async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
          router.push("/login");
        }
      },
    },
  ];

  const contentStyle: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };

  const menuStyle: React.CSSProperties = {
    boxShadow: "none",
  };

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.getClaims();

      if (error) throw error;
      setUserInfo(data?.claims.user_metadata as IUser);
    } catch {
      console.log("获取用户信息失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <Skeleton.Avatar className="h-9 w-9" active />;
  }

  if (!userInfo) {
    return (
      <Avatar
        className="h-9 w-9"
        style={{ backgroundColor: "#87d068" }}
        icon={<UserOutlined />}
      />
    );
  }
  return (
    <Dropdown
      menu={{ items }}
      popupRender={(menu) => (
        <div style={contentStyle}>
          <div className="flex items-center justify-center gap-2 px-2 py-3">
            <Avatar className="h-9 w-9" src={userInfo.avatar_url} />
            <div className="flex flex-col">
              <span className="text-sm">{userInfo.user_name}</span>
              <span className="text-xs text-gray-500">{userInfo.email}</span>
            </div>
          </div>
          <Divider style={{ margin: 0 }} />
          {React.cloneElement(
            menu as React.ReactElement<{
              style: React.CSSProperties;
            }>,
            { style: menuStyle },
          )}
        </div>
      )}
      trigger={["click"]}
    >
      <Avatar className="h-9 w-9" src={userInfo.avatar_url} />
    </Dropdown>
  );
};
export default SiteAvatar;
