export default function Favoritos() {
  const fav = localStorage.getItem('favoritos')
  return <>{fav}</>
}
