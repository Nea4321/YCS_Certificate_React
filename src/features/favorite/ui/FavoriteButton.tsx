import {Star} from "lucide-react";
import {useEffect, useState} from "react";
import {favorite} from "@/features/favorite/ui/styles";
import {
    FavoriteAddRequest,
    FavoriteCheckRequest,
    FavoriteDeleteRequest,
    FavoriteInfoRequest, FavoriteScheduleRequest
} from "@/features/favorite";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/app/store";
import {setFavoriteInfo, setFavoriteSchedule} from "@/shared/slice";
import {CheckDuplicate} from "@/features/login";

interface FavoriteButtonProps {
    exist?:string
    id?:string | number;
    type:string
}

/** 즐찾 버튼
 * 추가, 삭제, 체크
 * 체크해서 있으면 별표 색칠 되어있고 없으면 빈칸이고
 * 추가, 삭제 할 떄마다 통째로 redux에 저장. -> cancel 같은 복잡한 로직떄문에
 * */
export const FavoriteButton = ({exist,id,type}: FavoriteButtonProps)=>{
    const [isFavorite, setIsFavorite] = useState(false);
    const {check}=CheckDuplicate()
    // 로그인 되어 있을 때 저장되게 -> 월래는 액세스 토큰으로 비교할려 했는데 주옷 버그 떄문에 임시로 redux 유저 이름으로 대체
    // -> 물론 보안은 최악인 방법. -> redux값만 해킹해서 넣으면 즐찾 db요청을 허락하게 되는 거니까
    const name = useSelector((state: RootState) => state.user.userName)
    const dispatch = useDispatch();

    const toggleFavorite = async () => {
        if(name) {
        try {
            await check();
                if (!isFavorite) {
                    await FavoriteAddRequest(type, Number(id));
                    const favorite_data = await FavoriteInfoRequest();
                    const favorite_schedule = await FavoriteScheduleRequest();
                    dispatch(setFavoriteInfo(favorite_data))
                    dispatch(setFavoriteSchedule(favorite_schedule))

                } else {
                    await FavoriteDeleteRequest(type, Number(id));
                    const favorite_data = await FavoriteInfoRequest();
                    const favorite_schedule = await FavoriteScheduleRequest();
                    dispatch(setFavoriteInfo(favorite_data))
                    dispatch(setFavoriteSchedule(favorite_schedule))
                }

            setIsFavorite((prev) => !prev);
        } catch (err) {
            console.error("즐겨찾기 등록 실패:", err);
        }
    }};

    useEffect(() => {
        if (type && id) {
            FavoriteCheckRequest(type, Number(id)).then(check => setIsFavorite(check));
        }
    }, [type, id]);

    // 실험 용 const data = FavoriteInfoRequest()
    // console.log("info:",data)
    // console.log("id:",id)


    // 상단에 이름 으로 데이터 유,무를 판단함 (자격증이름, 학과이름)
    if (!exist) return null

    return (
    <button
        className={`${favorite.favoriteButton}`}
        onClick={toggleFavorite}
        aria-label="즐겨찾기"
    >
        <Star size={32} fill={isFavorite ? "#facc15" : "none"} strokeWidth={2} />
    </button>
    )


}