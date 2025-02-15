import ProfileTab from "@/src/components/mypage/ProfileTab";
import { api } from "@/src/utils/api";
import { cookies } from "next/headers";

export default async function MyPage() {
    const cookieStore = await cookies();
    const auth = cookieStore.get("auth");

    const getMyInfoInServerSide = async () => {
        try {
            const memberInfo = await api.get("/members/info", {
                headers: {
                    "X-Member": `Bearer ${auth?.value}`,
                },
            });
            return memberInfo.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const memberInfo = await getMyInfoInServerSide();

    return (
        <main className="w-full h-full overflow-y-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">마이페이지</h1>

                    <div>
                        <div className="flex space-x-1 rounded-xl bg-surface p-1 mb-8">
                            <a
                                href="/mypage"
                                className="w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-center cursor-pointer text-blue-500"
                            >
                                프로필
                            </a>
                            <a
                                href="/mypage/experience"
                                className="w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-center cursor-pointer"
                            >
                                경력
                            </a>
                        </div>
                        <div className="rounded-xl">
                            <ProfileTab initialData={memberInfo} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
