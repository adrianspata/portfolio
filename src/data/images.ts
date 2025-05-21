export const images: string[] = [
  "/images/glacierlogonew.jpg",
  "/images/PEACHrecordslogo.png",
  "/images/sunsunlogosketch.png",
  "/images/sotBagSteps2.jpg",
  "/images/sockerSuckerWebpage.jpg",
  "/images/SOTMayaMASTIKside.jpg",
  "/images/Aluminumziplock1.jpg",
  "/images/louis3sticksb&w.jpg",
  "/images/sotmagpage2526.jpg",
  "/images/squarecirclogonew.jpg",
  "/images/SOTMayaGODAJFside.jpg",
  "/images/launchInvitePack.jpg",
  "/images/sotWebpage.jpg",
  "/images/launcheinvite30th.jpg",
  "/images/drinkglasincense.jpg",
  "/images/loopliblogo.jpg",
  "/images/mastikappelbild.jpg",
  "/images/sotmagcoveropt4.jpg",
  "/images/incensemayaimg1text.jpg",
  "/images/godajfappelbild.jpg",
  "/images/SOTMagcoverplastic3.jpg",
  "/images/SOTMayaAGRUMEside.jpg",
  "/images/HYPNOSISMARK3D.png",
  "/images/SOTMagcoverplastic2.jpg",
  "/images/robP5.jpg",
  "/images/louisex4.jpg",
  "/images/louisSmell5.jpg",
  "/images/looplibDesktop.jpg",
  "/images/looplibMobile.jpg",
  "",
];

// Funktion för att blanda listan av bilder
export const shuffleImages = (imageList: string[]) => {
  return [...imageList].sort(() => Math.random() - 0.5);
};
