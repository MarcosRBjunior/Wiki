// Sprite de ícones das nações, montado uma única vez em App.jsx e referenciado via <use href="#icon-...">.
export function IconesNacao() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <symbol id="icon-ar" viewBox="0 0 24 24">
          <path d="M3 8h11a3 3 0 1 0-3-3" />
          <path d="M3 16h15a3 3 0 1 1-3 3" />
          <path d="M3 12h7" />
        </symbol>
        <symbol id="icon-agua" viewBox="0 0 24 24">
          <path d="M2 14c2-3 4-3 6 0s4 3 6 0 4-3 6 0" />
          <path d="M2 19c2-3 4-3 6 0s4 3 6 0 4-3 6 0" />
        </symbol>
        <symbol id="icon-terra" viewBox="0 0 24 24">
          <polyline points="3,19 9,8 13,14 16,10 21,19" />
        </symbol>
        <symbol id="icon-fogo" viewBox="0 0 24 24">
          <path d="M12 2c1 4-3 5-3 9a3 3 0 0 0 6 0c0-2-1-3-1-3 1 2 3 3 3 6a5 5 0 0 1-10 0c0-5 3-6 3-11 0-1 1-1 2-1Z" />
        </symbol>
      </defs>
    </svg>
  )
}
