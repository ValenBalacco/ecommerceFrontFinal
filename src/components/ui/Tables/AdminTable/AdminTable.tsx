import { ReactNode } from "react";
import styles from "./AdminTable.module.css";
import { LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import { ArrowDown, ArrowUp, Plus } from "lucide-react";

export interface IAdminTableProps<T> {
  data: T[];
  onAdd?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onArrow?: (item: T) => void;
  onAddItem?: (item: T) => void;
  renderItem: (item: T) => ReactNode;
  expandedId?: number | string | null; // acepta ambos tipos para mayor compatibilidad
}

export function AdminTable<T>({
  data,
  onAdd,
  onEdit,
  onDelete,
  onArrow,
  onAddItem,
  renderItem,
  expandedId,
}: IAdminTableProps<T>) {
  return (
    <div className={styles.container}>
      {onAdd && (
        <button className={styles.addButton} onClick={onAdd}>
          <LuPlus />
        </button>
      )}
      <div className={styles.table}>
        {Array.isArray(data) && data.length > 0 && (
          <>
            {data.map((item, idx) => (
              <div key={(item as any).id ?? idx} className={styles.row}>
                <div className={styles.content}>{renderItem(item)}</div>
                <div className={styles.actions}>
                  {onArrow && (
                    <button onClick={() => onArrow(item)}>
                      {expandedId === (item as any).id ? (
                        <ArrowUp />
                      ) : (
                        <ArrowDown />
                      )}
                    </button>
                  )}
                  {onAddItem && (
                    <button onClick={() => onAddItem(item)}>
                      <Plus />
                    </button>
                  )}
                  {onEdit && (
                    <button onClick={() => onEdit(item)}>
                      <LuPencil />
                    </button>
                  )}
                  {onDelete && (
                    <button onClick={() => onDelete(item)}>
                      <LuTrash2 />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}