/**
 * Scan'Mail 
 * @version 2.0 (2012/06)
 * @author : Nassim KACHA <nassim.kacha@blueicefield.com>
 * @license : LICENSE MIT
 */ 
 
 
// As we use Google Chart API to generate the QR code,
// we display the menu entries only if an internet connexion is available
function display() {
	ShowMenuItem("scanmail-menuseparator", window.navigator.onLine);
	ShowMenuItem("scanmail-emailAddressPopup", window.navigator.onLine);
}
