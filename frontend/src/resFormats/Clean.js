import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
} from "firebase/firestore";

import jsPDF from "jspdf";
import app from "../fire";
import { addOswald } from "../fonts/Oswald-Regular-normal";
import { addSourceSansPro } from "../fonts/SourceSansPro-normal";

export const cleanRes = async (userId, docId) => {
  const resume = await getRes(userId, docId);

  const doc = new jsPDF("p", "pt", "a4");
  const pageHeight =
    doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
  const pageWidth =
    doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
  addOswald();
  doc.setFont("Oswald-Regular", "normal");
  doc.setFontSize(20.8);
  doc.setCharSpace(2);

  const fullname = resume.user.first_name + " " + resume.user.last_name;
  doc.text(fullname.toUpperCase(), pageWidth / 2, pageHeight - 783, {
    align: "center",
  });

  doc.setCharSpace(0);
  addSourceSansPro();
  doc.setFont("SourceSansProRegular", "normal");
  doc.setFontSize(8);

  const jobPhone = resume.user.job + "            " + resume.user.phone;
  doc.text(jobPhone.toUpperCase(), pageWidth / 2 - 2, pageHeight - 763, {
    align: "center",
  });

  const dim_all = doc.getTextDimensions(jobPhone.toUpperCase());
  const w_phone = doc.getTextWidth(resume.user.phone.toUpperCase());

  const end = pageWidth / 2 + dim_all.w / 2 - 2;

  const img = new Image();
  img.src = "/images/phone.png";
  doc.addImage(
    "/images/phone.png",
    "PNG",
    end - w_phone - 8.1,
    pageHeight - 763 - dim_all.h * 0.68,
    dim_all.h * 0.8,
    dim_all.h * 0.8
  );

  img.src = "/images/profile.png";

  if (resume.user.profile) {
    doc.addImage(
      "/images/profile.png",
      "PNG",
      pageWidth / 3.3 + 0.5,
      pageHeight / 7.5,
      dim_all.h * 1.2,
      dim_all.h * 1.2
    );

    doc.setFont("Oswald-Regular", "normal");
    doc.setFontSize(10);
    doc.setCharSpace(0.5);
    doc.text(
      "PROFILE",
      pageWidth / 3.05 + dim_all.h,
      pageHeight / 7.5 + dim_all.h
    );

    doc.setFontSize(9);
    doc.setCharSpace(0.5);
    const profile = doc
      .setFont("SourceSansProRegular", "normal")
      .setFontSize(9)
      .setLineHeightFactor(1.4)
      .splitTextToSize(
        resume.user.profile +
          "kkkkkkkkkkkkkjhhhhhhhhhhhhhhhhhhhhhhhhhhh<b>hhhhhhhhhhhhhhhhhhhhhhhh</b>\nhhhhhhhhhhhhhhhhhhhhhhhhh\nhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhkkkkkkkkkkkkkkkkkkkkkkkkk",
        (pageWidth / 3) * 1.7
      );
    timelinePar(
      pageWidth / 3.05 + dim_all.h,
      pageHeight / 6.1,
      1.6,
      profile,
      17.5,
      1,
      doc
    );
  }

  console.log(
    "====================== resume creation done ======================"
  );
  //doc.save("Generated.pdf");
  return doc.output("blob");
};

export const getRes = async (userId, docId) => {
  const db = getFirestore(app);
  const jobs = [];
  const links = [];
  const education = [];
  const skills = [];
  const res = {};
  try {
    const querySnapshot = await getDocs(
      collection(db, `Users/${userId}/Documents/${docId}/Jobs`)
    );
    querySnapshot.forEach((doc) => {
      jobs.push(doc.data());
    });
    const querySnapshot2 = await getDocs(
      collection(db, `Users/${userId}/Documents/${docId}/Education`)
    );
    querySnapshot2.forEach((doc) => {
      education.push(doc.data());
    });
    const querySnapshot3 = await getDocs(
      collection(db, `Users/${userId}/Documents/${docId}/Skills`)
    );
    querySnapshot3.forEach((doc) => {
      skills.push(doc.data());
    });
    const querySnapshot4 = await getDocs(
      collection(db, `Users/${userId}/Documents/${docId}/Links`)
    );
    querySnapshot4.forEach((doc) => {
      links.push(doc.data());
    });

    const docRef = doc(db, `Users/${userId}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      res.user = docSnap.data();
    }
  } catch (err) {
    console.log("some error occure");
  }

  res.jobs = jobs;
  res.skills = skills;
  res.education = education;
  res.links = links;

  return res;
};

export const freshPdf = () => {
  const doc = new jsPDF("p", "pt", "a4");
  return doc.output("blob");
};

const timelinePar = (x, y, rad, par, space, width, doc) => {
  const dim = doc.getTextDimensions(par);
  const lineHeight = doc.getTextDimensions("soe text");
  doc.text(x, y, par);
  doc.setLineWidth(width);
  doc.circle(x - space, y - lineHeight.h / 4, rad);
  doc.line(
    x - space,
    y - lineHeight.h / 4 + rad,
    x - space,
    y - lineHeight.h * 1.3 - rad + dim.h
  );
  doc.circle(x - space, y + dim.h - lineHeight.h * 1.3, rad);
};
