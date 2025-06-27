import { Link } from "react-router-dom"
import { logoStyles } from "./styles"

export const Logo = () => {
  return (
    <div className={logoStyles.logo}>
      <Link to="/" className={logoStyles.logoLink}>
        <img
          src="/자격지신.png"
          alt="자격지신 로고"
          className={logoStyles.logoImage}
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.style.display = "none"
            const parent = target.parentElement
            if (parent && !parent.querySelector(".logo-fallback")) {
              const fallback = document.createElement("div")
              fallback.className = "logo-fallback"
              fallback.textContent = "자격지신"
              fallback.style.cssText = `
                font-size: 24px;
                font-weight: bold;
                color: var(--primary-color);
                padding: 8px 16px;
              `
              parent.appendChild(fallback)
            }
          }}
        />
      </Link>
    </div>
  )
}
