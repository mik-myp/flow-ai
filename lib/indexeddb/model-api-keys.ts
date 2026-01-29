const DB_NAME = "flow-ai";
const STORE_NAME = "model_api_keys";
const DB_VERSION = 1;

type ModelApiKeyRecord = {
  indexedDB_id: string;
  apiKey: string;
};

let dbPromise: Promise<IDBDatabase> | null = null;

const isIndexedDbAvailable = () =>
  typeof indexedDB !== "undefined" && indexedDB !== null;

function openDb(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "indexedDB_id" });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () =>
        reject(request.error ?? new Error("打开 IndexedDB 失败"));
    });
  }

  return dbPromise;
}

async function getStore(mode: IDBTransactionMode) {
  if (!isIndexedDbAvailable()) {
    return null;
  }

  const db = await openDb();
  const transaction = db.transaction(STORE_NAME, mode);
  const store = transaction.objectStore(STORE_NAME);

  return { transaction, store };
}

export async function saveModelApiKey(
  indexedDBId: string,
  apiKey: string,
): Promise<void> {
  if (!indexedDBId || !apiKey) {
    return;
  }

  const storeHandle = await getStore("readwrite");
  if (!storeHandle) {
    return;
  }

  await new Promise<void>((resolve, reject) => {
    storeHandle.store.put({
      indexedDB_id: indexedDBId,
      apiKey,
    } satisfies ModelApiKeyRecord);

    storeHandle.transaction.oncomplete = () => resolve();
    storeHandle.transaction.onabort = () =>
      reject(storeHandle.transaction.error ?? new Error("IndexedDB aborted"));
    storeHandle.transaction.onerror = () =>
      reject(storeHandle.transaction.error ?? new Error("IndexedDB failed"));
  });
}

export async function getModelApiKey(
  indexedDBId?: string | null,
): Promise<string | null> {
  if (!indexedDBId) {
    return null;
  }

  const storeHandle = await getStore("readonly");
  if (!storeHandle) {
    return null;
  }

  return new Promise((resolve, reject) => {
    const request = storeHandle.store.get(indexedDBId);

    request.onsuccess = () => {
      const result = request.result as ModelApiKeyRecord | undefined;
      resolve(result?.apiKey ?? null);
    };
    request.onerror = () =>
      reject(request.error ?? new Error("IndexedDB read failed"));
  });
}

export async function deleteModelApiKey(
  indexedDBId?: string | null,
): Promise<void> {
  if (!indexedDBId) {
    return;
  }

  const storeHandle = await getStore("readwrite");
  if (!storeHandle) {
    return;
  }

  await new Promise<void>((resolve, reject) => {
    storeHandle.store.delete(indexedDBId);

    storeHandle.transaction.oncomplete = () => resolve();
    storeHandle.transaction.onabort = () =>
      reject(storeHandle.transaction.error ?? new Error("IndexedDB aborted"));
    storeHandle.transaction.onerror = () =>
      reject(storeHandle.transaction.error ?? new Error("IndexedDB failed"));
  });
}
