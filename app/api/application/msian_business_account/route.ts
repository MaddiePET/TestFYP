import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { hashPassword } from "@/hashpw";

// Generates a random 16 digit savings account number
function generateAccountNumber() {
  let accountNo = "";

  for (let i = 0; i < 16; i++) {
    accountNo += Math.floor(Math.random() * 10).toString();
  }

  return accountNo;
}

export async function POST(req: Request) {
  const data = await req.json();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    console.log("FULL SUBMIT DATA:", JSON.stringify(data, null, 2));
    console.log("personalInfo:", data.personalInfo);
    console.log("contactInfo:", data.contactInfo);
    console.log("businessContact:", data.businessContact?.bus_email);
    console.log("businessAddress section:", data.businessAddress);
    console.log("businessAddress.businessAddress:", data.businessAddress?.businessAddress);
    console.log("businessAddress.mailingAddress:", data.businessAddress?.mailingAddress);
    console.log("business details:", data.businessParticulars);

    const personalInfo = data.personalInfo || {};
    const personalAddress = {
      add_1:
        personalInfo.add_1 ||
        personalInfo.streetAddress ||
        personalInfo.add1 ||
        "",

      add_2:
        personalInfo.add_2 ||
        personalInfo.city ||
        personalInfo.add2 ||
        "",

      postcode:
        personalInfo.postcode ||
        personalInfo.postal ||
        "",

      state:
        personalInfo.state ||
        "",

      country:
        personalInfo.country ||
        "Malaysia",
    };

    if (!personalAddress.add_1) throw new Error("Personal address line 1 is missing");

    const homeAddressRes = await client.query(
      `
      INSERT INTO banka."Address" (
        add_1, 
        add_2, 
        postcode, 
        state, 
        country
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING add_id
      `,
      [
        personalAddress.add_1,
        personalAddress.add_2,
        personalAddress.postcode,
        personalAddress.state,
        personalAddress.country,
      ]
    );
    const home_add = homeAddressRes.rows[0].add_id;

    const customerRes = await client.query(
      `
      INSERT INTO banka."Customer" (
        id_num, 
        full_name, 
        id_type, 
        dob,
        ph_no,
        email, 
        home_add
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING cust_id
      `,
      [
        data.personalInfo?.id_num || personalInfo.idNumber,
        data.personalInfo?.fullName || personalInfo.full_name,
        "IC",
        data.personalInfo?.dob || personalInfo.date_of_birth ,
        data.phoneVerification?.phoneNumber || personalInfo.ph_no_1,
        data.contactInfo?.email || personalInfo.email ,
        home_add,
      ]
    );
    const cust_id = customerRes.rows[0].cust_id;
    
    const rawPassword = data.account?.password;
    const hashedPassword = await hashPassword(rawPassword);

    let profileBuffer: Buffer | string | null = null;
    if (data.account?.img) {
      profileBuffer = data.account?.img.startsWith("data:image")
        ? Buffer.from(data.account?.img.split(",")[1], "base64")
        : Buffer.from(data.account?.img); 
    }

    const userRes = await client.query(
      `
      INSERT INTO banka."User" (
        cust_id, 
        username, 
        password, 
        status,
        img, 
        sec_phrase, 
        branch
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING user_id
      `,
      [
        cust_id,
        data.account?.username || null,
        hashedPassword || null,
        "PENDING",
        profileBuffer || null,
        data.account?.securityPhrase || null,
        data.businessAddress?.preferredBranch || null,
      ]
    );
    const user_id = userRes.rows[0].user_id;

    const businessAddress = {
      add_1:
        data.businessAddress?.businessAddress?.addressLine1 ||
        data.businessAddress?.addressLine1 || "",
      add_2:
        data.businessAddress?.businessAddress?.addressLine2 ||
        data.businessAddress?.addressLine2 || "",
      postcode:
        data.businessAddress?.businessAddress?.postcode ||
        data.businessAddress?.postcode || "",
      state:
        data.businessAddress?.businessAddress?.state ||
        data.businessAddress?.state || "",
      country:
        data.businessAddress?.businessAddress?.country ||
        data.businessAddress?.country || "Malaysia",
    };
    if (!businessAddress.add_1) throw new Error("Business address line 1 is missing");

    const mailingAddress = {
      add_1: data.businessAddress?.mailingAddress?.addressLine1 || "",
      add_2: data.businessAddress?.mailingAddress?.addressLine2 || "",
      postcode: data.businessAddress?.mailingAddress?.postcode || "",
      state: data.businessAddress?.mailingAddress?.state || "",
      country: data.businessAddress?.mailingAddress?.country || "Malaysia",
    };
    const isMailingSameAsBusiness = data.businessAddress?.isMailingSameAsBusiness ?? true;

    const businessAddressRes = await client.query(
      `
      INSERT INTO banka."Address" (
        add_1, 
        add_2, 
        postcode, 
        state, 
        country
      )
      VALUES ($1,$2,$3,$4,$5)
      RETURNING add_id
      `,
      [
        businessAddress.add_1,
        businessAddress.add_2,
        businessAddress.postcode,
        businessAddress.state,
        businessAddress.country,
      ]
    );
    const bus_add_id = businessAddressRes.rows[0].add_id;

    let mail_add_id = bus_add_id;
    if (!isMailingSameAsBusiness) {
      const mailingAddressRes = await client.query(
        `
        INSERT INTO banka."Address" (
          add_1, 
          add_2, 
          postcode, 
          state, 
          country
        )
        VALUES ($1,$2,$3,$4,$5)
        RETURNING add_id
        `,
        [
          mailingAddress.add_1,
          mailingAddress.add_2,
          mailingAddress.postcode,
          mailingAddress.state,
          mailingAddress.country,
        ]
      );
      mail_add_id = mailingAddressRes.rows[0].add_id;
    }

    // 7. Generate a unique 16 digit current account number
    let accountNo = generateAccountNumber();
    let accountExists = true;

    while (accountExists) {
      const checkAccount = await client.query(
        `
        SELECT account_no
        FROM banka."Current_account"
        WHERE account_no = $1
        `,
        [accountNo]
      );

      if (checkAccount.rows.length === 0) {
        accountExists = false;
      } else {
        accountNo = generateAccountNumber();
      }
    }

    await client.query(
      `
      INSERT INTO banka."Current_account" (
        account_no,
        user_id,
        reg_no,
        bus_name,
        bus_type,
        role, 
        bus_ph_no, 
        bus_email, 
        start_date,
        bus_add_id,
        mail_add_id,
        MSIC_code,
        MSIC_name
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      `,
      [
        accountNo,
        user_id,
        data.businessParticulars?.brn || data.businessParticulars?.reg_no || null,
        data.businessParticulars?.businessName || data.businessParticulars?.bus_name || null,
        data.businessParticulars?.businessType || data.businessParticulars?.bus_type || null,
        data.businessParticulars?.role,
        data.businessContact?.bus_ph_no || null,
        data.businessContact?.bus_email || null,
        data.businessParticulars?.startDate || null,
        bus_add_id,
        mail_add_id,
        data.businessParticulars?.msicCode,
        data.businessParticulars?.msicName
      ]
    );

    const supportingDocs = data.supportingDocuments || [];
    for (const doc of supportingDocs) {
      if (!doc?.name || !doc?.fileBase64) continue;
      const base64Part = doc.fileBase64.includes(",") ? doc.fileBase64.split(",")[1] : doc.fileBase64;
      const fileBuffer = Buffer.from(base64Part, "base64");

      await client.query(
        `
        INSERT INTO banka."Business_supporting_docs" (
          user_id, 
          doc_name, 
          doc_file
        )
        VALUES ($1,$2,$3)
        `,
        [user_id, doc.name, fileBuffer]
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({
      message: "Success",
      cust_id,
      user_id,
      home_add,
      bus_add_id,
      mail_add_id,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Application submit error:", err);
    return NextResponse.json(
      { error: "Failed", details: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}