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

const img = new Image();

export const cleanRes = async (userId, docId) => {
  const pos = {
    xRight: 203,
    lastYRight: 120,
    lastYleft: 120,
  };
  const tempTime = {
    on: false,
    last: 0,
  };
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
  const job = resume.user.job ? resume.user.job : "";
  const phone = resume.user.phone ? resume.user.phone : "";

  const jobPhone = job + "            " + phone;

  doc.text(jobPhone.toUpperCase(), pageWidth / 2 - 2, pageHeight - 763, {
    align: "center",
  });

  const dim_all = doc.getTextDimensions(jobPhone.toUpperCase());

  const w_phone = doc.getTextWidth(phone.toUpperCase());

  const end = pageWidth / 2 + dim_all.w / 2 - 2;

  img.src = "/images/phone.png";
  if (resume.user.phone) {
    doc.addImage(
      "/images/phone.png",
      "PNG",
      end - w_phone - 8.1,
      pageHeight - 763 - dim_all.h * 0.68,
      dim_all.h * 0.8,
      dim_all.h * 0.8
    );
  }

  console.log(resume);
  printProfile(pos, tempTime, resume, doc);
  printEducation(pos, tempTime, resume, doc);

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

const printProfile = (pos, tempTime, resume, doc) => {
  if (resume.user.profile) {
    img.src = "/images/profile.png";
    doc.addImage("/images/profile.png", "PNG", 180, 112, 9.5, 9.5);
    doc.setFont("Oswald-Regular", "normal").setFontSize(9);
    doc.setCharSpace(1);
    doc.text(pos.xRight, pos.lastYRight, "PROFILE");
    console.log(pos.lastYRight + "llll");
    doc.setCharSpace(0);
    doc.setFont("SourceSansProRegular", "normal");
    doc.setFontSize(9).setLineHeightFactor(1.5);

    const profileText = doc.splitTextToSize(
      resume.user.profile.blocks[0].text,
      330
    );

    pos.lastYRight += 20;
    timelinePar(pos.xRight, pos.lastYRight, 1.6, profileText, 18, 1, doc, pos);
  }
};

const printEducation = (pos, tempTime, resume, doc) => {
  if (resume.education) {
    img.src = "/images/education.png";

    doc.addImage(
      "/images/education.png",
      "PNG",
      178.5,
      pos.lastYRight + 10,
      13,
      13
    );
    doc.setFont("Oswald-Regular", "normal").setFontSize(9);
    pos.lastYRight += 19.5;
    doc.setCharSpace(1);
    doc.text(pos.xRight, pos.lastYRight, "EDUCATION");
    doc.setCharSpace(0);
    doc.setFont("SourceSansProRegular", "normal");
    doc.setFontSize(11).setLineHeightFactor(1.5);
    pos.lastYRight += 20;
    resume.education.forEach((edu) => {
      const educationText = [
        doc.splitTextToSize(edu.diploma + ", " + edu.institution, 330),
        doc.splitTextToSize(getBlockText(edu.description.blocks), 330),
        doc.splitTextToSize(
          edu.start.substr(0, 4) + " - " + edu.finish.substr(0, 4),
          330
        ),
      ];

      console.log(educationText);
      timeLineYear(
        pos.xRight,
        pos.lastYRight,
        1.6,
        educationText,
        18,
        1,
        doc,
        "SourceSansProRegular",
        "normal",
        pos,
        tempTime
      );
    });
  }
};
const timelinePar = (x, y, rad, par, space, width, doc, pos) => {
  const dim = doc.getTextDimensions(par);
  const lineHeight = doc.getTextDimensions("some text");
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

  pos.lastYRight += dim.h;
};

const timelineMul = (x, y, rad, par, space, width, doc, pos, tempTime) => {
  const dim = doc.getTextDimensions(par);
  const lineHeight = doc.getTextDimensions("some text");
  doc.text(x, y, par);
  doc.setLineWidth(width);
  doc.circle(x - space, y - lineHeight.h / 4, rad);
  if (tempTime.on) {
    doc.line(x - space, y - lineHeight.h / 4 - rad, x - space, tempTime.last);
    tempTime.last = y - lineHeight.h / 4 + rad;
  } else {
    tempTime.on = true;
    tempTime.last = y - lineHeight.h / 4 + rad;
  }

  pos.lastYRight += dim.h;
};

const timeLineYear = (
  x,
  y,
  rad,
  data,
  space,
  width,
  doc,
  font,
  type,
  pos,
  tempTime
) => {
  doc.setFont(font, type);
  doc.text(x, y, data[0]);
  doc.setTextColor(130, 139, 162);
  pos.lastYRight += 14;
  doc.text(x, pos.lastYRight, data[2]);
  pos.lastYRight += 16;
  doc.setFontSize(9).setTextColor(0, 0, 0);
  doc.text(x, pos.lastYRight, data[1]);
  doc.setLineWidth(width);
  doc.circle(x - space, y - 2.875, rad);
  if (tempTime.on) {
    doc.line(x - space, y - 2.875 - rad, x - space, tempTime.last);
    tempTime.last = y - 2.875 + rad;
  } else {
    tempTime.on = true;
    doc.line(
      x - space,
      y - 2.875 + rad,
      x - space,
      y -
        2.875 -
        rad +
        doc.getTextDimensions(data[0]).h +
        doc.getTextDimensions(data[1]).h +
        doc.getTextDimensions(data[2]).h +
        7
    );

    const a = y - 2.875 + rad;
    const b =
      y -
      2.875 -
      rad +
      doc.getTextDimensions(data[0]).h +
      doc.getTextDimensions(data[1]).h +
      doc.getTextDimensions(data[2]).h +
      7;

    console.log(a + " " + b);
    tempTime.last = y - 2.875 + rad;
  }
};

const circledHeader = (rad, x, y, header, width, doc) => {
  const headerWidth = doc.getTextWidth(header);
  doc.text(header, x, y, {
    align: "center",
  });
  doc.setLineWidth(width);
  doc.circle(
    x - headerWidth / 2 - 10,
    y - doc.getTextDimensions(header).h / 3,
    rad
  );
  doc.circle(
    x - headerWidth / 2 + doc.getTextWidth(header) + 10,
    y - doc.getTextDimensions(header).h / 3,

    rad
  );
};

const createLeft = (doc) => {};

const getBlockText = (blocks) => {
  var text = [];

  blocks.forEach((block) => {
    text.push(block.text);
  });

  return text.join("\n");
};
