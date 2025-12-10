import axios from "axios";
import { v4 as uuidv4 } from 'uuid';


const BASE_URL = "http://128.199.176.167:8072/api/v1";
const N8N_URL = "https://auto.lab.kediritechnopark.com/webhook";

/**
 * POST /chat
 * Chat normal (response sekali jadi JSON)
 *
 * Request body:
 * {
 *   "message": "string",
 *   "conversationId": "string",
 *   "useTools": true,
 *   "topK": 1073741824
 * }
 *
 * Response 200:
 * {
 *   "content": "Halo! Ada yang bisa saya bantu? ..."
 * }
 */

function getConversationId(tenantId) {
  let conversationId = localStorage.getItem('conversationId');
  if (!conversationId) {
    conversationId = uuidv4();
    localStorage.setItem('conversationId', conversationId);
  }
  return conversationId;
}


export async function chat({message, tenantId}) {
  const conversationId = getConversationId();

  const formData = new FormData();

  let xType = "text"; // default

  if (message) {
    formData.append("message", message);
    xType = "text";
  }

  // if (data?.file instanceof Blob || data.file instanceof File) {
  //   formData.append("data", data.file, data.file.name || "upload.bin");

  //   if (data.file.type?.startsWith("image/")) {
  //     xType = "image";
  //   } else {
  //     xType = "data";
  //   }
  // }

  // if (data.audio instanceof Blob) {
  //   formData.append("data", data.audio, "voice-message.webm");
  //   xType = "voice";
  // }

  formData.append("sessionId", conversationId);
  // formData.append("useTools", data.useTools ?? true);
  // formData.append("topK", data.topK ?? 1073741824);

  const res = await axios.post(`${N8N_URL}/webchat`, formData, {
    headers: {
      "x-tenant-id": tenantId,
      "x-type": xType,
    },
  });

  return res.data;
}

export async function chatPlayground({message, tenantId}) {
  const conversationId = getConversationId();

  const formData = new FormData();

  let xType = "text"; // default

  if (message) {
    formData.append("message", message);
    xType = "text";
  }

  // if (data.file instanceof Blob || data.file instanceof File) {
  //   formData.append("data", data.file, data.file.name || "upload.bin");

  //   if (data.file.type?.startsWith("image/")) {
  //     xType = "image";
  //   } else {
  //     xType = "data";
  //   }
  // }

  // if (data.audio instanceof Blob) {
  //   formData.append("data", data.audio, "voice-message.webm");
  //   xType = "voice";
  // }

  formData.append("sessionId", conversationId);
  // formData.append("useTools", data.useTools ?? true);
  // formData.append("topK", data.topK ?? 1073741824);

  const res = await axios.post(`${N8N_URL}/playground`, formData, {
    headers: {
      "x-tenant-id": tenantId,
      "x-type": xType,
    },
  });

  return res.data;
}




/**
 * Helper untuk handle streaming (text, audio, audio+text)
 * Streaming response menggunakan ReadableStream
 */
async function streamRequest(endpoint, body, onChunk, tenantId) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "x-tenant-id": tenantId,
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify(body),
  });

  if (!response.body) {
    throw new Error("ReadableStream not supported");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    if (onChunk) onChunk(chunk);
  }
}

/**
 * POST /chat/stream
 * Mengembalikan teks via stream (text/event-stream)
 */
// export function chatStream({ message, useTools = true, topK = 1073741824 }, onChunk, tenantId) {
//   const conversationId = getConversationId();
//   return streamRequest("/chat/stream", { message, conversationId, useTools, topK }, onChunk);
// }

/**
 * POST /chat/streamAudio
 * Mengembalikan audio via stream (text/event-stream)
 * Biasanya data berupa base64 audio chunk
 */
// export function chatStreamAudio({ message, useTools = true, topK = 1073741824 }, onChunk, tenantId) {
//   const conversationId = getConversationId();
//   return streamRequest("/chat/streamAudio", { message, conversationId, useTools, topK }, onChunk);
// }

/**
 * POST /chat/streamAudioText
 * Mengembalikan teks + audio via stream (text/event-stream)
 * Data bisa berisi kombinasi text dan audio
 */
// export function chatStreamAudioText({ message, useTools = true, topK = 1073741824 }, onChunk, tenantId) {
//   const conversationId = getConversationId();
//   return streamRequest("/chat/streamAudioText", { message, conversationId, useTools, topK }, onChunk);
// }

/**
 * GET /kb/documents
 * Ambil daftar dokumen knowledge base
 *
 * Response 200:
 * [
 *   {
 *     "id": "2bea96a3-148f-4d6c-929e-257ded1aea5b",
 *     "title": "KEPBER SOP SAMSAT JATIM 2023 FIX ALL",
 *     "source": "BAPENDA",
 *     "chunkCount": 349,
 *     "createdAt": "2025-09-12T10:27:15.755+00:00"
 *   },
 *   {
 *     "id": "a4548c87-1f56-4e27-b0e1-c8e39914f03f",
 *     "title": "SP SAMSAT JATIM 2023",
 *     "source": "BAPENDA",
 *     "chunkCount": 381,
 *     "createdAt": "2025-09-12T10:33:05.731+00:00"
 *   }
 * ]
 */

// Ambil semua dokumen
export async function getDocuments(tenantId) {
  const res = await axios.get(`${N8N_URL}/kb/list`, { headers: {"x-tenant-id": tenantId} });
  return res.data;
}

export async function uploadDocument(file, tenantId) {
  const formData = new FormData();
  formData.append("data", file);

  const res = await axios.post(`${N8N_URL}/kb`, formData, {
    headers: {
      "x-tenant-id": tenantId,
      "x-filename": file.name, // metadata nama file
    },
  });
  return res.data;
}


// Download dokumen tertentu dan langsung trigger download di browser
export async function downloadDocument(key, tenantId) {
  try {
    const res = await axios.get(`${N8N_URL}/kb`, {
      headers: {
        "x-tenant-id": tenantId,
        "x-filename": key, // metadata nama file
      },
      responseType: "blob", // supaya hasilnya bisa langsung jadi file
    });

    // Buat URL dari blob
    const url = window.URL.createObjectURL(new Blob([res.data]));

    // Buat elemen anchor untuk trigger download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", key); // nama file saat disimpan

    document.body.appendChild(link);
    link.click();

    // Bersihkan
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Gagal mengunduh dokumen:", error);
    throw error;
  }
}

// Hapus dokumen tertentu
export async function deleteDocument(key, tenantId) {
  const res = await axios.delete(`${N8N_URL}/kb`,{
    headers: {
      "x-tenant-id": tenantId,
      "x-filename": key, // metadata nama file
    },
  });
  return res.data;
}

export async function getWAStatus(tenantId) {
  const res = await axios.get("https://auto.lab.kediritechnopark.com/webhook/wa/status-device", { headers: {"x-tenant-id": tenantId} });
  return res.data;
}

export async function connectWA(tenantId) {
  const res = await axios.post("https://auto.lab.kediritechnopark.com/webhook/wa/connect-device", {}, { headers: {"x-tenant-id": tenantId} });
  return res.data;
}

export async function disconnectWA(tenantId) {
  const res = await axios.delete("https://auto.lab.kediritechnopark.com/webhook/wa/disconnect-device", { headers: {"x-tenant-id": tenantId} });
  return res.data;
}

export async function checkWAActive(tenantId) {
  const res = await axios.get("https://auto.lab.kediritechnopark.com/webhook/wa/check", { headers: {"x-tenant-id": tenantId} });
  return res.data;
}

export async function connectWAToggle(tenantId) {
  const res = await axios.put("https://auto.lab.kediritechnopark.com/webhook/wa/connect", {}, { headers: {"x-tenant-id": tenantId} });
  return res.data;
}

export async function disconnectWAToggle(tenantId) {
  const res = await axios.put("https://auto.lab.kediritechnopark.com/webhook/wa/disconnect", {}, { headers: {"x-tenant-id": tenantId} });
  return res.data;
}

export async function checkTGActive(tenantId) {
  const res = await axios.get("https://auto.lab.kediritechnopark.com/webhook/tg/check", { headers: {"x-tenant-id": tenantId} });
  return res.data;
}

export async function connectTGToggle(tenantId) {
  const res = await axios.put("https://auto.lab.kediritechnopark.com/webhook/tg/connect", {}, { headers: {"x-tenant-id": tenantId} });
  return res.data;
}

export async function disconnectTGToggle(tenantId) {
  const res = await axios.put("https://auto.lab.kediritechnopark.com/webhook/tg/disconnect", {}, { headers: {"x-tenant-id": tenantId} });
  return res.data;
}

export async function checkWebActive(tenantId) {
  const res = await axios.get("https://auto.lab.kediritechnopark.com/webhook/web/check", { headers: {"x-tenant-id": tenantId} });
  return res.data;
}

export async function connectWebToggle(tenantId) {
  const res = await axios.put("https://auto.lab.kediritechnopark.com/webhook/web/connect", {}, { headers: {"x-tenant-id": tenantId} });
  return res.data;
}

export async function disconnectWebToggle(tenantId) {
  const res = await axios.put("https://auto.lab.kediritechnopark.com/webhook/web/disconnect", {}, { headers: {"x-tenant-id": tenantId} });
  return res.data;
}

export async function disconnectWebApp(tenantId) {
  const res = await axios.put("https://auto.lab.kediritechnopark.com/webhook/webapp/disconnect", {}, { headers: {"x-tenant-id": tenantId} });
  return res.data;
}

export async function connectWebApp(tenantId) {
  const res = await axios.put("https://auto.lab.kediritechnopark.com/webhook/webapp/connect", {}, { headers: {"x-tenant-id": tenantId} });
  return res.data;
}

export async function checkWebAppStatus(tenantId) {
  const res = await axios.get("https://auto.lab.kediritechnopark.com/webhook/webapp/check", { headers: {"x-tenant-id": tenantId} });
  return res.data;
}

export async function getReport1d(tenantId) {
  const res = await axios.get("https://auto.lab.kediritechnopark.com/webhook/report/1d", { headers: {"x-tenant-id": tenantId} });
  return res.data;
  
  //   contoh respon [{"hour":0,"period_label":"00:00","unique_users":0,"total_messages":0,"voice_messages":0,"text_messages":0,"avg_response_time":"0","total_tokens":0},{"hour":1,"period_label":"01:00","unique_users":0,"total_messages":0,"voice_messages":0,"text_messages":0,"avg_response_time":"0","total_tokens":0},{"hour":2,"period_label":"02:00","unique_users":1,"total_messages":2,"voice_messages":0,"text_messages":2,"avg_response_time":"93881.80","total_tokens":852},{"hour":3,"period_label":"03:00","unique_users":1,"total_messages":6,"voice_messages":0,"text_messages":6,"avg_response_time":"2.07","total_tokens":2269},{"hour":4,"period_label":"04:00","unique_users":0,"total_messages":0,"voice_messages":0,"text_messages":0,"avg_response_time":"0","total_tokens":0},{"hour":5,"period_label":"05:00","unique_users":0,"total_messages":0,"voice_messages":0,"text_messages":0,"avg_response_time":"0","total_tokens":0},{"hour":6,"period_label":"06:00","unique_users":0,"total_messages":0,"voice_messages":0,"text_messages":0,"avg_response_time":"0","total_tokens":0},{"hour":7,"period_label":"07:00","unique_users":0,"total_messages":0,"voice_messages":0,"text_messages":0,"avg_response_time":"0","total_tokens":0},{"hour":8,"period_label":"08:00","unique_users":0,"total_messages":0,"voice_messages":0,"text_messages":0,"avg_response_time":"0","total_tokens":0},{"hour":9,"period_label":"09:00","unique_users":0,"total_messages":0,"voice_messages":0,"text_messages":0,"avg_response_time":"0","total_tokens":0},{"hour":10,"period_label":"10:00","unique_users":0,"total_messages":0,"voice_messages":0,"text_messages":0,"avg_response_time":"0","total_tokens":0},{"hour":11,"period_label":"11:00","unique_users":0,"total_messages":0,"voice_messages":0,"text_messages":0,"avg_response_time":"0","total_tokens":0},{"hour":12,"period_label":"12:00","unique_users":0,"total_messages":0,"voice_messages":0,"text_messages":0,"avg_response_time":"0","total_tokens":0},{"hour":13,"period_label":"13:00","unique_users":0,"total_messages":0,"voice_messages":0,"text_messages":0,"avg_response_time":"0","total_tokens":0},{"hour":14,"period_label":"14:00","unique_users":0,"total_messages":0,"voice_messages":0,"text_messages":0,"avg_response_time":"0","total_tokens":0},{"hour":15,"period_label":"15:00","unique_users":0,"total_messages":0,"voice_messages":0,"text_messages":0,"avg_response_time":"0","total_tokens":0},{"hour":16,"period_label":"16:00","unique_users":1,"total_messages":1,"voice_messages":0,"text_messages":1,"avg_response_time":"1.78","total_tokens":346},{"hour":17,"period_label":"17:00","unique_users":0,"total_messages":0,"voice_messages":0,"text_messages":0,"avg_response_time":"0","total_tokens":0},{"hour":18,"period_label":"18:00","unique_users":0,"total_messages":0,"voice_messages":0,"text_messages":0,"avg_response_time":"0","total_tokens":0},{"hour":19,"period_label":"19:00","unique_users":0,"total_messages":0,"voice_messages":0,"text_messages":0,"avg_response_time":"0","total_tokens":0},{"hour":20,"period_label":"20:00","unique_users":0,"total_messages":0,"voice_messages":0,"text_messages":0,"avg_response_time":"0","total_tokens":0},{"hour":21,"period_label":"21:00","unique_users":0,"total_messages":0,"voice_messages":0,"text_messages":0,"avg_response_time":"0","total_tokens":0},{"hour":22,"period_label":"22:00","unique_users":0,"total_messages":0,"voice_messages":0,"text_messages":0,"avg_response_time":"0","total_tokens":0},{"hour":23,"period_label":"23:00","unique_users":0,"total_messages":0,"voice_messages":0,"text_messages":0,"avg_response_time":"0","total_tokens":0}]
}

export async function getReport7d(tenantId) {
  const res = await axios.get("https://auto.lab.kediritechnopark.com/webhook/report/7d", { headers: {"x-tenant-id": tenantId} });
  return res.data;

  // contoh respon [{"date":"2025-09-12T17:00:00.000Z","period_label":"13 Sep","unique_users":0,"total_messages":0,"voice_messages":0,"text_messages":0,"avg_response_time":"0","total_tokens":0},{"date":"2025-09-13T17:00:00.000Z","period_label":"14 Sep","unique_users":0,"total_messages":0,"voice_messages":0,"text_messages":0,"avg_response_time":"0","total_tokens":0},{"date":"2025-09-14T17:00:00.000Z","period_label":"15 Sep","unique_users":0,"total_messages":0,"voice_messages":0,"text_messages":0,"avg_response_time":"0","total_tokens":0},{"date":"2025-09-15T17:00:00.000Z","period_label":"16 Sep","unique_users":2,"total_messages":5,"voice_messages":0,"text_messages":0,"avg_response_time":"2.46","total_tokens":0},{"date":"2025-09-16T17:00:00.000Z","period_label":"17 Sep","unique_users":4,"total_messages":6,"voice_messages":0,"text_messages":0,"avg_response_time":"4.91","total_tokens":2171},{"date":"2025-09-17T17:00:00.000Z","period_label":"18 Sep","unique_users":7,"total_messages":53,"voice_messages":5,"text_messages":39,"avg_response_time":"16.22","total_tokens":28142},{"date":"2025-09-18T17:00:00.000Z","period_label":"19 Sep","unique_users":3,"total_messages":9,"voice_messages":0,"text_messages":9,"avg_response_time":"31295.22","total_tokens":3467}]
}

export async function getReport30d(tenantId) {
  const res = await axios.get("https://auto.lab.kediritechnopark.com/webhook/report/30d", { headers: {"x-tenant-id": tenantId} });
  return res.data;
}

export async function getTopTopics(tenantId) {
  const res = await axios.get("https://auto.lab.kediritechnopark.com/webhook/topics", { headers: {"x-tenant-id": tenantId} });
  return res.data;
}

export async function getAgentProfile(tenantId) {
  const res = await axios.get("https://auto.lab.kediritechnopark.com/webhook/agent-profile", { headers: {"x-tenant-id": tenantId} });
  return res.data;
}

export async function updateAgentProfile(data, tenantId) {
  const res = await axios.put("https://auto.lab.kediritechnopark.com/webhook/agent-profile", data, { headers: {"x-tenant-id": tenantId} });
  return res.data;
}