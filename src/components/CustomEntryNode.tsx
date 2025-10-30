import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import contentModelIcon from '../assets/Content Model.png';
import localeIcon from '../assets/Language.png';

interface CustomNodeData {
  entryName: string;
  contentType: string;
  locale: string;
  childCount?: number;
  colorHeader?: string;
}

const CustomEntryNode = ({ data }: { data: CustomNodeData }) => {
  return (
    <div className='custom-entry-node'>
      <Handle type='target' position={Position.Left} />

      <div className='node-content'>
        <div className='entry-name'>{data.entryName}</div>

        <div
          className='content-type'
          style={{
            borderColor: data.colorHeader ? data.colorHeader : '#48B2DE',
          }}>
          <img src={contentModelIcon} alt={data.contentType} />
          <span>{data.contentType}</span>
        </div>

        <div className='locale'>
          <img src={localeIcon} alt={data.locale} />
          <span>{data.locale}</span>
        </div>
      </div>

      {data.childCount !== undefined && data.childCount > 0 && (
        <>
          <Handle type='source' position={Position.Right} id='source' />
          <div className='child-count-badge'>{data.childCount}</div>
        </>
      )}
    </div>
  );
};

export default memo(CustomEntryNode);
