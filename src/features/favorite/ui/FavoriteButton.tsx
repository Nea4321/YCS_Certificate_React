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

interface FavoriteButtonProps {
    exist?:string
    id?:string | number;
    type:string
}

export const FavoriteButton = ({exist,id,type}: FavoriteButtonProps)=>{
    const [isFavorite, setIsFavorite] = useState(false);
    const name = useSelector((state: RootState) => state.user.userName)
    const dispatch = useDispatch();

    const toggleFavorite = async () => {
        if(name) {
        try {
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

    const data = FavoriteInfoRequest()
    console.log("info:",data)
    console.log("id:",id)


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