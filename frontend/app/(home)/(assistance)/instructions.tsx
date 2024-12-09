import { ensureString } from '@/common/utils';
import InstructionComponent from '@/components/instruction/InstructionComponent';
import { useLocalSearchParams } from 'expo-router';

export default function Instructions() {
  const search = useLocalSearchParams();
  console.log('Instructions: ', search);
  const part = search.part || 'Chain';
  const action = search.action || 'Check';

  console.log('Calling InstructionComponent: ' + part + ' ' + action);
  return (
    <InstructionComponent part={ensureString(part)} action={ensureString(action)}/>
  );
}
