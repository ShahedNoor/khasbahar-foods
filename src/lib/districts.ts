/** All 64 districts of Bangladesh, grouped by division. */
export const DISTRICTS: { district: string; districtBn: string; division: string }[] = [
  // Dhaka
  ["Dhaka", "ঢাকা"], ["Faridpur", "ফরিদপুর"], ["Gazipur", "গাজীপুর"], ["Gopalganj", "গোপালগঞ্জ"],
  ["Kishoreganj", "কিশোরগঞ্জ"], ["Madaripur", "মাদারীপুর"], ["Manikganj", "মানিকগঞ্জ"], ["Munshiganj", "মুন্সিগঞ্জ"],
  ["Narayanganj", "নারায়ণগঞ্জ"], ["Narsingdi", "নরসিংদী"], ["Rajbari", "রাজবাড়ী"], ["Shariatpur", "শরীয়তপুর"],
  ["Tangail", "টাঙ্গাইল"],
].map(([district, districtBn]) => ({ district, districtBn, division: "Dhaka" }))
  .concat(
    [
      ["Bagerhat", "বাগেরহাট"], ["Chuadanga", "চুয়াডাঙ্গা"], ["Jashore", "যশোর"], ["Jhenaidah", "ঝিনাইদহ"],
      ["Khulna", "খুলনা"], ["Kushtia", "কুষ্টিয়া"], ["Magura", "মাগুরা"], ["Meherpur", "মেহেরপুর"],
      ["Narail", "নড়াইল"], ["Satkhira", "সাতক্ষীরা"],
    ].map(([district, districtBn]) => ({ district, districtBn, division: "Khulna" })),
    [
      ["Bandarban", "বান্দরবান"], ["Brahmanbaria", "ব্রাহ্মণবাড়িয়া"], ["Chandpur", "চাঁদপুর"], ["Chattogram", "চট্টগ্রাম"],
      ["Cox's Bazar", "কক্সবাজার"], ["Cumilla", "কুমিল্লা"], ["Feni", "ফেনী"], ["Khagrachhari", "খাগড়াছড়ি"],
      ["Lakshmipur", "লক্ষ্মীপুর"], ["Noakhali", "নোয়াখালী"], ["Rangamati", "রাঙ্গামাটি"],
    ].map(([district, districtBn]) => ({ district, districtBn, division: "Chattogram" })),
    [
      ["Bogura", "বগুড়া"], ["Chapainawabganj", "চাঁপাইনবাবগঞ্জ"], ["Joypurhat", "জয়পুরহাট"], ["Naogaon", "নওগাঁ"],
      ["Natore", "নাটোর"], ["Pabna", "পাবনা"], ["Rajshahi", "রাজশাহী"], ["Sirajganj", "সিরাজগঞ্জ"],
    ].map(([district, districtBn]) => ({ district, districtBn, division: "Rajshahi" })),
    [
      ["Barguna", "বরগুনা"], ["Barishal", "বরিশাল"], ["Bhola", "ভোলা"], ["Jhalokati", "ঝালকাঠি"],
      ["Patuakhali", "পটুয়াখালী"], ["Pirojpur", "পিরোজপুর"],
    ].map(([district, districtBn]) => ({ district, districtBn, division: "Barishal" })),
    [
      ["Habiganj", "হবিগঞ্জ"], ["Moulvibazar", "মৌলভীবাজার"], ["Sunamganj", "সুনামগঞ্জ"], ["Sylhet", "সিলেট"],
    ].map(([district, districtBn]) => ({ district, districtBn, division: "Sylhet" })),
    [
      ["Dinajpur", "দিনাজপুর"], ["Gaibandha", "গাইবান্ধা"], ["Kurigram", "কুড়িগ্রাম"], ["Lalmonirhat", "লালমনিরহাট"],
      ["Nilphamari", "নীলফামারী"], ["Panchagarh", "পঞ্চগড়"], ["Rangpur", "রংপুর"], ["Thakurgaon", "ঠাকুরগাঁও"],
    ].map(([district, districtBn]) => ({ district, districtBn, division: "Rangpur" })),
    [
      ["Jamalpur", "জামালপুর"], ["Mymensingh", "ময়মনসিংহ"], ["Netrokona", "নেত্রকোনা"], ["Sherpur", "শেরপুর"],
    ].map(([district, districtBn]) => ({ district, districtBn, division: "Mymensingh" })),
  );

export const DIVISIONS = ["Dhaka", "Chattogram", "Khulna", "Rajshahi", "Barishal", "Sylhet", "Rangpur", "Mymensingh"];

export const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** Starting charges: home district cheapest, Dhaka division next, rest of the country highest. Edit in /admin. */
export function defaultCharge(district: string, division: string) {
  if (district === "Narsingdi") return 60;
  if (division === "Dhaka") return 100;
  return 150;
}
