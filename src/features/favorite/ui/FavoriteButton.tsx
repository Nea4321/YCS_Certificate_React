import {Star} from "lucide-react";
import {useEffect, useState} from "react";
import {favorite} from "@/features/favorite/ui/styles";
import {
    FavoriteAddRequest,
    FavoriteCheckRequest,
    FavoriteDeleteRequest,
    FavoriteInfoRequest
} from "@/features/favorite";
import {useSelector} from "react-redux";
import {RootState} from "@/app/store";

interface FavoriteButtonProps {
    exist?:string
    id?:string | number;
    type:string
}

export const FavoriteButton = ({exist,id,type}: FavoriteButtonProps)=>{
    const [isFavorite, setIsFavorite] = useState(false);
    const name = useSelector((state: RootState) => state.user.userName)
    const toggleFavorite = async () => {
        if(name) {
        try {
                if (!isFavorite) {
                    await FavoriteAddRequest(type, Number(id));
                } else {
                    await FavoriteDeleteRequest(type, Number(id));
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